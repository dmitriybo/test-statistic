import importHelpers from 'eslint-plugin-import-helpers'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import prettier from 'eslint-plugin-prettier'
import _import from 'eslint-plugin-import'
import noRelativeImportPaths from 'eslint-plugin-no-relative-import-paths'
import stylisticJs from '@stylistic/eslint-plugin-js'
import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import tsParser from '@typescript-eslint/parser'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import js from '@eslint/js'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default [
  {
    ignores: [
      '**/webpack',
      '**/public',
      'src/assets',
      '**/eslint-rules',
      '**/.yarn',
      '**/dist',
      '**/build',
      '**/*.config.{mjs,js}',
    ],
  },
  ...compat.extends(
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ),
  {
    plugins: {
      'import-helpers': importHelpers,
      prettier,
      import: fixupPluginRules(_import),
      'no-relative-import-paths': noRelativeImportPaths,
      '@stylistic/js': stylisticJs,
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.commonjs,
      },
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          js: true,
          jsx: true,
        },
        project: './tsconfig.json',
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: false,
          trailingComma: 'all',
          singleQuote: true,
          printWidth: 120,
          tabWidth: 2,
          endOfLine: 'auto',
        },
      ],
      'comma-dangle': 'off',
      'eol-last': 'error',
      'global-require': 'off',
      'import/no-cycle': 'off',
      'no-throw-literal': 'off',
      '@typescript-eslint/no-throw-literal': 'off',
      'import-helpers/order-imports': [
        'error',
        {
          alphabetize: {
            ignoreCase: true,
            order: 'asc',
          },

          groups: ['/^react/', 'module', ['parent', 'sibling', 'index']],
          newlinesBetween: 'always',
        },
      ],
      'no-relative-import-paths/no-relative-import-paths': [
        'error',
        {
          allowSameFolder: true,
          rootDir: 'src',
          prefix: '',
        },
      ],
      'import/no-unresolved': 'off',
      'import/no-duplicates': 'error',
      'import/no-extraneous-dependencies': [
        'error',
        {
          devDependencies: true,
          bundledDependencies: false,
          optionalDependencies: false,
          peerDependencies: false,
        },
      ],
      'import/prefer-default-export': 'off',
      'import/newline-after-import': [
        'error',
        {
          count: 1,
        },
      ],
      'no-restricted-globals': ['error', 'React'],
      'max-len': [
        'error',
        {
          code: 120,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true
        },
      ],
      '@stylistic/js/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],
      'no-param-reassign': 'off',
      'no-trailing-spaces': 'error',
      quotes: [
        'error',
        'single',
        {
          avoidEscape: true,
        },
      ],
      'react-hooks/exhaustive-deps': 'off',
      'react/destructuring-assignment': [
        'warn',
        'always',
        {
          ignoreClassFields: true,
        },
      ],
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-sort-props': [
        'error',
        {
          ignoreCase: true,
        },
      ],
      'react/jsx-uses-react': 'off',
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/state-in-constructor': ['error', 'never'],
      'react/jsx-curly-brace-presence': [2, 'never'],
      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 2,
      semi: ['error', 'never'],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-var-requires': 2,
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'lines-between-class-members': [
        'error',
        'always',
        {
          exceptAfterSingleLine: true,
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      'object-shorthand': ['error', 'always'],
      curly: 'error',
      'id-match': ['error', '^[$a-zA-Z0-9_]*$'],
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: null,
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'parameter',
          format: ['camelCase', 'snake_case', 'PascalCase'],
          leadingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
        },
      ],
      eqeqeq: 'error',
      'no-debugger': 'warn',
    },
  },
]
