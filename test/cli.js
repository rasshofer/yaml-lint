const path = require("path");
const tap = require("tap");
const exec = require("child_process").exec;

const CLI_PATH = path.join(__dirname, "../cli.js");
const VALID_FILE = path.join(__dirname, "valid.yaml");
const MISSING_FILE = path.join(__dirname, "missing.yaml");
const INVALID_FILES = path.join(__dirname, "invalid*.yaml");
const ALL_FILES = path.join(__dirname, "*.yaml");

const execCmd = (cmd) => new Promise((resolve, reject) => {
  exec(cmd, { encoding: 'utf8' }, (error, stdout) => {
    error ? reject(error) : resolve(stdout);
  });
});

// LINTER
tap.test("Missing file", (childTest) => {
  childTest.rejects(execCmd(`${CLI_PATH} ${MISSING_FILE}`));
  childTest.end();
});

tap.test("Single file", (childTest) => {
  childTest.resolves(execCmd(`${CLI_PATH} ${VALID_FILE}`));
  childTest.end();
});

tap.test("Multi files", (childTest) => {
  childTest.rejects(execCmd(`${CLI_PATH} ${INVALID_FILES}`));
  childTest.end();
});

tap.test("Ignore option", (childTest) => {
  childTest.resolves(execCmd(`${CLI_PATH} ${ALL_FILES} --ignore ${INVALID_FILES}`));
  childTest.end();
});
