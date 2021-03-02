module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    quotes: ["warn", "double"],
    "prettier/prettier": [
      "warn",
      {
        "useTabs": "false",
        "singleQuote": false,
        "printWidth": 100,
        "semi": true,
        "trailingComma": "none",
        "bracketSpacing": true,
        "jsxBracketSameLine": true,
        "arrowParens": "avoid",
        "requirePragma": false,
        "proseWrap": "preserve"
      }
    ]
  },
};
