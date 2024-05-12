/* eslint-disable @typescript-eslint/naming-convention */
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  reportUnusedDisableDirectives: true,
  env: {
    mocha: true,
    browser: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.lint.json',
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.lint.json',
      },
    },
  },
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'plugin:@typescript-eslint/strict', 'prettier'],
  rules: {
    'no-plusplus': 'off',
    'no-param-reassign': 'off',
    'prefer-destructuring': 'off',
    'default-param-last': 'off',
    'prefer-spread': 'off',
    'no-continue': 'off',
    'no-constructor-return': 'off',
    'consistent-return': 'off',

    'import/extensions': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['./vitest.*.mts', 'rollup.config.mjs', './test/**'] },
    ],

    /** @todo consider to replace `any` with `unknown` */
    '@typescript-eslint/no-explicit-any': 'off',

    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-magic-numbers': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'default',
        format: ['camelCase'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      {
        selector: ['import', 'parameter'],
        format: ['camelCase', 'PascalCase'],
      },

      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allow',
        trailingUnderscore: 'allow',
      },

      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },

      {
        selector: 'interface',
        format: ['PascalCase'],
        filter: 'i18n',
      },

      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        leadingUnderscore: 'allow',
      },
    ],
  },
  overrides: [
    {
      files: ['./test/**/*'],
      rules: {
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/ban-ts-comment': [
          'error',
          {
            // this is used for typechecking tests
            'ts-expect-error': false,
          },
        ],
      },
    },
  ],
};
