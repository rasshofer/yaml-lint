import { readFile } from 'fs';
import {
  loadAll,
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
} from 'js-yaml';

const schemas = {
  FAILSAFE_SCHEMA,
  JSON_SCHEMA,
  CORE_SCHEMA,
  DEFAULT_SCHEMA,
} as const;

type Schema = keyof typeof schemas;

export type Options = {
  schema?: Schema;
};

export const lint = (content: string, opts?: Options): Promise<boolean> =>
  new Promise((resolve, reject) => {
    try {
      loadAll(content, undefined, {
        schema: schemas[opts?.schema ?? 'DEFAULT_SCHEMA'],
      });
      resolve(true);
    } catch (e) {
      reject(e);
    }
  });

export const lintFile = (file: string, opts?: Options): Promise<boolean> =>
  new Promise((resolve, reject) => {
    readFile(file, 'utf8', (err, content) => {
      if (err) {
        reject(err);
      } else {
        lint(content, opts)
          .then((result) => {
            resolve(result);
          })
          .catch((e) => {
            reject(e);
          });
      }
    });
  });
