import { YAMLException } from 'js-yaml';
import { resolve } from 'path';
import { lintFile } from '..';

describe('YAML Lint', () => {
  it('lints valid files', async () => {
    const result = await lintFile(resolve(__dirname, 'test1.yaml'));
    expect(result).toBe(true);
  });

  it('fails for invalid files', async () => {
    await expect(lintFile(resolve(__dirname, 'test2.yaml'))).rejects.toThrow(
      YAMLException,
    );
  });

  it('fails for missing files', async () => {
    await expect(
      lintFile(resolve(__dirname, 'test123.yaml')),
    ).rejects.toMatchObject({
      code: 'ENOENT',
      syscall: 'open',
    });
  });

  it('suppports custom schemas', async () => {
    const result = await lintFile(resolve(__dirname, 'test3.yaml'), {
      schema: 'FAILSAFE_SCHEMA',
    });
    expect(result).toBe(true);
  });
});
