import globals from 'globals'

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',   // Use ES6 modules (import/export)
      globals: {
        ...globals.node,      // Node.js environment globals like `require`, `module`, etc.
        ...globals.es2021     // ES2021 globals like `Promise`, `Set`, etc.
      }
    },
    rules: {
      // Best Practices
      'no-var': 'error',  // Enforce let/const over var
      'prefer-const': 'error',  // Enforce const over let where possible
      'no-console': 'off',  // Allow console (important for Node.js)

      // Code Style
      'semi': ['error', 'never'],
      'quotes': ['error', 'single'],
      'indent': ['error', 2],
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': ['error', {
        'skipBlankLines': false,  // Enforce no spaces on blank lines
        'ignoreComments': false  // Enforce no spaces in comment lines as well
      }],

      // ES6 Specific
      'prefer-arrow-callback': 'error',  // Prefer arrow functions
      'arrow-spacing': ['error', { 'before': true, 'after': true }],

      // Node.js Specific
      'no-buffer-constructor': 'error',  // Prevent usage of Buffer constructor (deprecated in Node)

      // Code Quality
      'no-unused-vars': ['error', { 'args': 'none' }],  // Disallow unused variables
      'eqeqeq': ['error', 'always'],  // Enforce strict equality (=== and !==)
      'no-undef': 'error',  // Disallow usage of undefined variables
      'no-warning-comments': [ // Flag TODO/FIXME comments
        'warn',
        {
          terms: ['todo', 'fixme'],
          location: 'start'
        }
      ]
    }
  }
]
