const fs = require('fs');
const merge = require('lodash.merge');
const yaml = require('js-yaml');

const DEFAULT_LINT_OPTION = {
  schema: 'DEFAULT_SAFE_SCHEMA'
};

function lint(content, opts) {

  const options = merge({}, DEFAULT_LINT_OPTION, opts);

  return new Promise((resolve, reject) => {
    try {
      yaml.safeLoad(content, {
        schema: yaml[options.schema]
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });

}

function lintFile(file, opts) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        lint(content, opts).then((result) => {
          resolve(result);
        }).catch((e) => {
          reject(e);
        });
      }
    });
  });
}

module.exports = {
  lint: lint,
  lintFile: lintFile
};
