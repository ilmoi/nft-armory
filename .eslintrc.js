module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ['plugin:vue/essential', 'airbnb-base', 'prettier'],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  plugins: ['vue', '@typescript-eslint'],
  overrides: [
    {
      files: ['*.ts', '*.js', '*.vue'],
      rules: {
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/prefer-default-export': 'off',
        'no-shadow': 'off',
        'no-unused-vars': 'off',
        'class-methods-use-this': 'off',
        'no-underscore-dangle': 'off',
        'max-len': 'off',
        'no-restricted-syntax': 'off',
      },
    },
  ],
  // todo don't see a good way of solving it, will have to disable the lint
  // settings: {
  //   'import/resolver': {
  //     alias: {
  //       map: [['@', './src/']],
  //       extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue'],
  //     },
  //   },
  // },
};
