var fs = require('fs');
var path = require('path');
var tap = require('tap');
var yamlLint = require('../yaml-lint');

// API

tap.equal(typeof yamlLint, 'object');
tap.equal(typeof yamlLint.lint, 'function');
tap.equal(typeof yamlLint.lintFile, 'function');

tap.test('Valid file', function (childTest) {
  yamlLint.lintFile(path.resolve(__dirname, 'test1.yaml')).then(function () {
    childTest.end();
  }).catch(function (e) {
    throw e;
  });
});

tap.test('Invalid file', function (childTest) {
  yamlLint.lintFile(path.resolve(__dirname, 'test2.yaml')).then(function () {
    throw new Error();
  }).catch(function () {
    childTest.end();
  });
});

tap.test('Missing file', function (childTest) {
  yamlLint.lintFile(path.resolve(__dirname, 'test123.yaml')).then(function () {
    throw new Error();
  }).catch(function () {
    childTest.end();
  });
});
