module.exports = {
  env: {
    node: true,
    jest: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  ignorePatterns: ['.eslintrc.js', 'dist/', 'coverage/', 'node_modules/', '*.test.ts'],
  rules: {
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
};