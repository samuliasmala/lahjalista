import { fixupConfigRules } from '@eslint/compat';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';
import { configs as tsConfigs } from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: tsConfigs.recommendedTypeChecked,
  allConfig: tsConfigs.all,
});

const eslintConfig = [
  ...fixupConfigRules([
    ...compat.config({
      root: true,
      extends: [
        'plugin:n/recommended',
        'plugin:import/recommended',
        'next/core-web-vitals',
        'plugin:prettier/recommended',
      ],

      // espree (default parser) set here to prevent following error: Cannot serialize key "parse" in parser: Function values are not supported.
      parser: 'espree',
      // parserOptions added so import.meta.url can be used. Reference: https://github.com/eslint/eslint/discussions/16037#discussioncomment-2998062
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 'latest',
      },

      rules: {
        // No React component definitions allowed inside components
        'react/no-unstable-nested-components': 'warn',

        // Additional import rules
        'import/no-dynamic-require': 'error',
        'import/no-absolute-path': 'error',
        'import/no-useless-path-segments': 'warn',
        'import/newline-after-import': 'warn',

        // Use warn instead of error for prettier issues and some other rules
        'prettier/prettier': 'warn',
        'prefer-const': 'warn',
        'no-unused-vars': 'warn',
        'no-debugger': 'warn',
        'no-console': 'off',
      },

      overrides: [
        {
          files: ['**/*.ts?(x)'],
          parser: '@typescript-eslint/parser',
          parserOptions: {
            project: './tsconfig.json',
            sourceType: 'module',
            ecmaFeatures: {
              jsx: true,
            },
          },
          plugins: ['@tanstack/query'],
          extends: [
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:import/typescript',
            'plugin:@tanstack/eslint-plugin-query/recommended',
          ],

          rules: {
            // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
            'no-dupe-class-members': 'off',
            // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/477)
            'no-undef': 'off',

            // Handled by import/typescript
            // n/no-missing-import is used here instead of node/no-missing-import because seems like eslint-plugin-node is not updated frequently
            // node/no-missing-import: https://github.com/mysticatea/eslint-plugin-node | n/no-missing-import: https://github.com/eslint-community/eslint-plugin-n
            'n/no-missing-import': 'off',

            // Disable some rules which are difficult for beginners
            '@typescript-eslint/no-unsafe-assignment': 'warn',
            '@typescript-eslint/no-unsafe-member-access': 'warn',
            '@typescript-eslint/no-unsafe-argument': 'warn',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unsafe-return': 'warn',
            '@typescript-eslint/no-unsafe-call': 'warn',

            // Use warn instead of error for some rules
            'prefer-const': 'warn',
            '@typescript-eslint/restrict-plus-operands': 'warn',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/require-await': 'warn',
          },
        },
      ],
    }),
    {
      // .next folder added to ignores. This is otherwise being ESLinted
      ignores: ['**/.next/'],
    },
  ]),
];
export default eslintConfig;
/*
export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
);
*/
/*
export default [
  ...fixupConfigRules(
    compat.extends(
      // section 1
      'eslint:recommended',
      'plugin:n/recommended',
      'plugin:import/recommended',
      'next/core-web-vitals',
      'plugin:prettier/recommended',

      // section 2
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:import/typescript',
      'plugin:@tanstack/eslint-plugin-query/recommended',
    ),
  ),
  {
    rules: {
      'n/no-extraneous-import': [
        'error',
        {
          allowModules: ['@styles/globals.css'],
        },
      ],

      // section 1

      'react/no-unstable-nested-components': 'warn',
      'import/no-dynamic-require': 'error',
      'import/no-absolute-path': 'error',
      'import/no-useless-path-segments': 'warn',
      'import/newline-after-import': 'warn',
      'prettier/prettier': 'warn',
      'no-unused-vars': 'warn',
      'prefer-const': 'warn',
      'no-debugger': 'warn',
      'no-console': 'off',

      // section 2

      'no-dupe-class-members': 'off',
      'no-undef': 'off',
      'n/no-missing-import': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      'prefer-const': 'warn',
      '@typescript-eslint/restrict-plus-operands': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/require-await': 'warn',
    },
    /*
    plugins: {
      '@tanstack/query': tanstackQuery,
    },
},
];
*/
