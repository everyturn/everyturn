const {override, addWebpackResolve} = require('customize-cra')

// TODO remove after https://github.com/webpack/webpack/issues/9509
module.exports = override(
  addWebpackResolve({
    alias: {
      '@everyturn/core': '@everyturn/core/lib',
    }
  }),
);
