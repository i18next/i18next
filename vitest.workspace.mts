import { readdirSync } from 'node:fs';
// eslint-disable-next-line import/no-extraneous-dependencies
import { defineWorkspace } from 'vitest/config';
import type { UserProjectConfigExport } from 'vitest/config';

export default defineWorkspace([
  {
    test: {
      name: 'runtime',
      dir: './test/runtime',
    },
  },

  {
    test: {
      name: 'compatibility',
      dir: './test/compatibility',
    },
  },

  /**
   * If you need to test multiple typescript configurations (like misc) simply create a file named tsconfig.{customName}.json
   * and this script will automatically create a new workspace named with the dirName followed by `customName`
   */
  ...readdirSync('./test/typescript', { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .reduce<UserProjectConfigExport[]>((workspaces, dir) => {
      const dirPath = `test/typescript/${dir.name}` as const;

      const tsConfigFiles = readdirSync(dirPath).filter(
        // Do not include temporary vitest tsconfig files
        (it) => it.startsWith('tsconfig.') && it.endsWith('.json') && !it.includes('vitest-temp'),
      );

      tsConfigFiles.forEach((tsConfigFileName) => {
        const workspaceName =
          tsConfigFileName === 'tsconfig.json'
            ? dir.name
            : `${dir.name}-${tsConfigFileName.split('.')[1]}`;

        workspaces.push({
          test: {
            dir: `./${dirPath}`,
            name: `typescript-${workspaceName}`,
            typecheck: {
              enabled: true,
              include: [`**/${dirPath}/*.test.ts`],
              tsconfig: `./${dirPath}/${tsConfigFileName}`,
            },
          },
        });
      });

      return workspaces;
    }, []),
]);
