#!/usr/bin/env node
import { resolve } from 'path';
import nconf from 'nconf';
import consola from 'consola';
import { sync as globbySync } from 'globby';
import { lintFile, Options } from '.';

nconf
  .argv()
  .env({
    match: /^yamllint/i,
  })
  .file({
    file: resolve(process.cwd(), '.yaml-lint.json'),
  });

const options: {
  schema?: Options['schema'];
  ignore?: string;
} = {
  schema:
    nconf.get('schema') ||
    nconf.get('yamllint_schema') ||
    nconf.get('YAMLLINT_SCHEMA'),
  ignore:
    nconf.get('ignore') ||
    nconf.get('yamllint_ignore') ||
    nconf.get('YAMLLINT_IGNORE'),
};
const config = nconf.get();
let files: string[] = [];

(config._ || []).forEach((pattern: string) => {
  files = files.concat(
    globbySync(resolve(process.cwd(), pattern).replace(/\\/g, '/'), {
      dot: true,
      ignore: []
        .concat(config.ignore)
        .filter(Boolean)
        .map((item) => resolve(process.cwd(), item).replace(/\\/g, '/')),
      absolute: true,
    }),
  );
});

if (files.length === 0) {
  consola.error('YAML Lint failed.');
  consola.error('No YAML files were found matching your selection.');
  process.exit(1);
} else {
  Promise.allSettled(
    files.map((file) =>
      lintFile(file, options).catch((err: Error) => {
        throw Object.assign(err, {
          file,
        });
      }),
    ),
  ).then((results) => {
    const errors = results.filter(
      (result) => result.status === 'rejected',
    ) as PromiseRejectedResult[];
    if (errors.length > 0) {
      consola.error(
        `YAML Lint failed for ${errors.length} file${
          errors.length === 1 ? '' : 's'
        }`,
      );
      errors.forEach((error) => {
        consola.log(error.reason.file);
        consola.error(error.reason);
      });
      process.exit(1);
    } else {
      consola.success('YAML Lint successful.');
    }
  });
}
