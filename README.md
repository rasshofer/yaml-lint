# YAML Lint

> A simple (CLI) tool to lint YAML files

[![Build Status](https://travis-ci.org/rasshofer/yaml-lint.svg)](https://travis-ci.org/rasshofer/yaml-lint)
[![Dependency Status](https://david-dm.org/rasshofer/yaml-lint/status.svg)](https://david-dm.org/rasshofer/yaml-lint)
[![Dependency Status](https://david-dm.org/rasshofer/yaml-lint/dev-status.svg)](https://david-dm.org/rasshofer/yaml-lint)

## Usage

```shell
npm install --save-dev yaml-lint
```

```js
var yamlLint = require('yaml-lint');

yamlLint.lint('test: 123').then(function () {
  console.log('Valid YAML file.');
}).catch(function (error) {
  console.error('Invalid YAML file.', error);
});
```

## CLI

```shell
npm install -g yaml-lint
```

```shell
$ yamllint test.yaml
```

## options

### `schema` (string)

> Specifies a schema to use

- `DEFAULT_FULL_SCHEMA` All supported YAML types (default)
- `FAILSAFE_SCHEMA` Only strings, arrays, and plain objects ([http://www.yaml.org/spec/1.2/spec.html#id2802346](http://www.yaml.org/spec/1.2/spec.html#id2802346))
- `JSON_SCHEMA` All JSON-supported types ([http://www.yaml.org/spec/1.2/spec.html#id2803231](http://www.yaml.org/spec/1.2/spec.html#id2803231))
- `CORE_SCHEMA` Same as `JSON_SCHEMA` ([http://www.yaml.org/spec/1.2/spec.html#id2804923](http://www.yaml.org/spec/1.2/spec.html#id2804923))
- `DEFAULT_SAFE_SCHEMA` All supported YAML types, without unsafe ones (`!!js/undefined`, `!!js/regexp`, and `!!js/function`) ([http://yaml.org/type/](http://yaml.org/type/))

## Changelog

* 0.0.4
  * Print file names when logging YAML errors while using the CLI
* 0.0.3
  * Implement check for empty file selections while using the CLI
* 0.0.2
  * Prettier error messages within CLI
  * Add shebang for CLI
* 0.0.1
  * Initial version

## License

Copyright (c) 2016 [Thomas Rasshofer](http://thomasrasshofer.com/)  
Licensed under the MIT license.

See LICENSE for more info.

## Contributors

- [@rasshofer](https://github.com/rasshofer)
- [@sapegin](https://github.com/sapegin)
