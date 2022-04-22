import { resolve as resolvePath } from 'path';
import { exec } from 'child_process';

const CLI_PATH = resolvePath(__dirname, '..', '..', 'dist', 'cli.js');

const runCommand = (args: string) =>
  new Promise((resolve, reject) => {
    exec(
      `node ${CLI_PATH} ${args}`,
      {
        encoding: 'utf8',
      },
      (error, stdout) => {
        if (error) {
          reject(error);
        } else {
          resolve(stdout);
        }
      },
    );
  });

describe('YAML Lint CLI', () => {
  it('lints valid files', async () => {
    expect(await runCommand(`"src/__tests__/test1.yaml"`)).toMatch(
      'YAML Lint successful',
    );
  });

  it('fails for invalid files', async () => {
    await expect(runCommand(`"src/__tests__/test2.yaml"`)).rejects.toThrow(
      'YAML Lint failed for 1 file',
    );
  });

  it('displays all failing files', async () => {
    await expect(runCommand(`"src/**/*.yaml"`)).rejects.toThrow(
      'YAML Lint failed for 2 files',
    );
  });

  it('fails for missing files', async () => {
    await expect(runCommand(`missing.yaml`)).rejects.toThrow(
      'No YAML files were found matching your selection',
    );
  });

  it('suppports custom schemas', async () => {
    expect(
      await runCommand(`--schema=CORE_SCHEMA "src/__tests__/test3.yaml"`),
    ).toMatch('YAML Lint successful');
  });

  it('allows to ignore files', async () => {
    expect(
      await runCommand(
        `"src/**/*.yaml" --ignore "src/__tests__/test2.yaml" --ignore "src/__tests__/test4.yaml"`,
      ),
    ).toMatch('YAML Lint successful');
  });
});
