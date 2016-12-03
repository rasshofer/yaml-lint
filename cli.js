#!/usr/bin/env node

var path = require('path');
var nconf = require('nconf');
var yamlLint = require('./yaml-lint');
var leprechaun = require('leprechaun');
var merge = require('lodash.merge');
var snakeCase = require('lodash.snakecase');
var glob = require('glob');
var Promise = require('bluebird');

var options = {};

nconf.argv().env({
  match: /^yamllint/i
}).file({
  file: path.resolve(process.cwd(), '.yaml-lint.json')
});

[
  'schema'
].forEach(function (key) {
  var env = snakeCase(key);
  options[key] = nconf.get(key) || nconf.get('yamllint_' + env.toLowerCase()) || nconf.get('YAMLLINT' + env.toUpperCase());
});

var config = nconf.get();

var files = [];

(config._ || []).forEach(function (file) {
  files = files.concat(glob.sync(file));
});

Promise.map(files, function (file) {
  return yamlLint.lintFile(file, options);
}).then(function () {
  leprechaun.success('YAML Lint successful.');
}).catch(function (error) {
  leprechaun.error('YAML Lint failed.');
  console.error(error.message);
  process.exit(1);
});
