module.exports = {
  env: {
    node: true,
  },
  extends: [
    'plugin:@nodeart/react',
  ],
  plugins: [
    '@nodeart',
  ],
  ignorePatterns: [ '.eslintrc.js', 'configs/*' ],
  rules: {
    camelcase: [ 'off' ],
    'sonarjs/cognitive-complexity': [ 'error', 70 ],
    'no-extra-parens': 'off',
    indent: [ 'error', 2, { ignoredNodes: [ 'TemplateLiteral' ] } ],

    // eslint fails when parsing
    'template-curly-spacing': [ 'off' ],
  },
};
