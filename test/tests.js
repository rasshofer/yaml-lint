const path = require('path');
const tap = require('tap');
const yamlLint = require('../yaml-lint');

// API

tap.equal(typeof yamlLint, 'object');
tap.equal(typeof yamlLint.lint, 'function');
tap.equal(typeof yamlLint.lintFile, 'function');

tap.test('Valid file', (childTest) => {
  yamlLint.lintFile(path.resolve(__dirname, 'test1.yaml')).then(() => {
    childTest.end();
  }).catch((e) => {
    throw e;
  });
});

tap.test('Invalid file', (childTest) => {
  yamlLint.lintFile(path.resolve(__dirname, 'test2.yaml')).then(() => {
    throw new Error();
  }).catch(() => {
    childTest.end();
  });
});

tap.test('Missing file', (childTest) => {
  yamlLint.lintFile(path.resolve(__dirname, 'test123.yaml')).then(() => {
    throw new Error();
  }).catch(() => {
    childTest.end();
  });
});
