import globals from 'globals'
import jestPlugin from 'eslint-plugin-jest'

export default [
  {
    // General rules for all JS files
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',  // Use ES6 modules (import/export)
      globals: {
        ...globals.node,      // Node.js environment globals like `require`, `module`, etc.
        ...globals.es2021     // ES2021 globals like `Promise`, `Set`, etc.
      }
    },
    rules: {
      // Best Practices
      'no-var': 'error',
      'prefer-const': 'error',
      'no-console': 'off',

      // Code Style
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': ['error', {
        'skipBlankLines': false,
        'ignoreComments': false
      }],

      // ES6 Specific
      'prefer-arrow-callback': 'error',
      'arrow-spacing': ['error', { 'before': true, 'after': true }],

      // Node.js Specific
      'no-buffer-constructor': 'error',

      // Code Quality
      'no-unused-vars': ['error', { 'args': 'none' }],
      'eqeqeq': ['error', 'always'],
      'no-undef': 'error',
      'no-warning-comments': ['warn', { terms: ['todo', 'fixme'], location: 'start' }]
    }
  },
  {
    // Specific Jest-related rules for .test.js files
    files: ['**/*.test.js'],  // Match all test files in any folder
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,  // Use globals provided by the 'globals' package for Jest
        jest: 'readonly'  // Manually include Jest globals (describe, test, expect)
      }
    },
    plugins: {
      jest: jestPlugin  // Jest plugin for linting test files
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/valid-expect': 'error'
    }
  }
]
