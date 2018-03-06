#!/usr/bin/env node

const path = require('path');
const nconf = require('nconf');
const leprechaun = require('leprechaun');
const snakeCase = require('lodash.snakecase');
const glob = require('glob');
const yamlLint = require('./yaml-lint');

const options = {};

nconf.argv().env({
  match: /^yamllint/i
}).file({
  file: path.resolve(process.cwd(), '.yaml-lint.json')
});

[
  'schema',
  'ignore'
].forEach((key) => {
  const env = snakeCase(key);
  options[key] = nconf.get(key) || nconf.get('yamllint_' + env.toLowerCase()) || nconf.get('YAMLLINT' + env.toUpperCase());
});

const config = nconf.get();

let files = [];

config._.forEach((pattern) => {
  files = files.concat(glob.sync(pattern, {
    nocase: true,
    dot: true,
    ignore: config.ignore
  }));
});

if (files.length === 0) {
  leprechaun.error('YAML Lint failed.');
  leprechaun.error('No YAML files were found matching your selection.');
  process.exit(1);
}

Promise.all(files.map((file) => yamlLint
  .lintFile(file, options)
  .catch((err) => {
    err.file = file;
    return err;
  })
)).then((results) => {
  const errors = results.filter((result) => result !== undefined);

  if (errors.length === 0) {
    leprechaun.success('YAML Lint successful.');
    process.exit(0);
  }

  errors.forEach((error) => {
    leprechaun.error('YAML Lint failed for ' + error.file);
    leprechaun.error(error.message);
  });
  process.exit(1);
});
