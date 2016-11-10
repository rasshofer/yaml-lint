var fs = require('fs');
var merge = require('lodash.merge');
var Promise = require('bluebird');
var yaml = require('js-yaml');

function lint(content, opts) {

  var options = merge({
    schema: 'DEFAULT_SAFE_SCHEMA'
  }, opts);

  return new Promise(function (resolve, reject) {
    try {
      var doc = yaml.safeLoad(content, {
        schema: yaml[options.schema]
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });

}

function lintFile(file, opts) {
  return new Promise(function (resolve, reject) {
    fs.readFile(file, 'utf8', function (err, content) {
      if (err) {
        reject(err);
      } else {
        lint(content, opts).then(function (result) {
          resolve(result);
        }).catch(function (e) {
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
