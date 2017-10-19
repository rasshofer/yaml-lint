var fs = require('fs');
var merge = require('lodash.merge');
var Promise = require('bluebird');
var yaml = require('js-yaml');


function lint(content, opts) {

  opts = opts || {};

  var options = merge({
    schema: 'DEFAULT_SAFE_SCHEMA'
  }, opts);

  return new Promise(function (resolve, reject) {
    try {
      if (!opts.allowMulti) {
        yaml.safeLoad(content, {
          schema: yaml[options.schema]
        });
        resolve();
      } else {
        yaml.safeLoadAll(content, function(doc) {}, {
          schema: yaml[options.schema]
        });
        resolve();
      }
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
          resolve(file);
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
