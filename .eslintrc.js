module.exports = {
  extends: "airbnb",
  parser: 'babel-eslint',

  globals: {
    __DEV__: true,
    window: {},
    document: {},
    localStorage: {},
    FileReader: {},
    File: {},
  },

  rules: {
    'no-plusplus': [
      'error',
      {
        'allowForLoopAfterthoughts': true
      },
    ],
    // `js` and `jsx` are common extensions
    // `mjs` is for `universal-router` only, for now
    'import/extensions': [
      'error',
      'always',
      {
        js: 'never',
        jsx: 'never',
        mjs: 'never',
      },
    ],

    // Not supporting nested package.json yet
    // https://github.com/benmosher/eslint-plugin-import/issues/458
    'import/no-extraneous-dependencies': 'off',

    // Recommend not to leave any console.log in your code
    // Use console.error, console.warn and console.info instead
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info'],
      },
    ],

    // Allow js files to use jsx syntax, too
    'react/jsx-filename-extension': 'off',

    // https://github.com/kriasoft/react-starter-kit/pull/961
    // You can reopen this if you still want this rule
    'react/prefer-stateless-function': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'no-unused-vars': 'warn',
    'padded-blocks': 'warn',
    'no-restricted-globals': 'warn',
    'react/prop-types': 'warn',
  },
};
