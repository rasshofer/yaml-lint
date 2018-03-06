const path = require("path");
const tap = require("tap");
const yamlLint = require("../yaml-lint");

const VALID_FILE = path.join(__dirname, "valid.yaml");
const INVALID_FILE = path.join(__dirname, "invalid.yaml");
const MISSING_FILE = path.join(__dirname, "missing.yaml");

// LINTER

tap.equal(typeof yamlLint, "object");
tap.equal(typeof yamlLint.lint, "function");
tap.equal(typeof yamlLint.lintFile, "function");

tap.test("Valid file", (childTest) => {
  childTest.resolves(yamlLint.lintFile(VALID_FILE));
  childTest.end();
});

tap.test("Invalid file", (childTest) => {
  const expectError = new Error('unexpected end of the stream within a double quoted scalar');

  expectError.name = 'YAMLException';
  childTest.rejects(yamlLint.lintFile(INVALID_FILE), expectError);
  childTest.end();
});

tap.test("Missing file", (childTest) => {
  const expectError = new Error('ENOENT: no such file or directory');

  childTest.rejects(yamlLint.lintFile(MISSING_FILE), expectError);
  childTest.end();
});
