module.exports = {
  extends: [
    // add more generic rulesets here, such as:
    'airbnb',
    'plugin:vue/recommended',
  ],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 8,
    parser: 'babel-eslint',
  },
  rules: {
    // override/add rules settings here, such as:
    // 'vue/no-unused-vars': 'error'
    'no-param-reassign': 0,
    'no-plusplus': 'off',
    'yoda': 'off',
    'max-len': ['warn',
      {
        'code': 120,
        'tabWidth': 2,
        'ignoreStrings': true,
      },
    ],
    'vue/singleline-html-element-content-newline': ['error', {
      'ignoreWhenNoAttributes': true,
      'ignores': ['p', 'span', 'a'],
    }],
    'import/no-cycle': 'off',
    'no-continue': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
  }
};
