/* jshint ignore:start */
Package.describe({
  name: 'ethereum:web3',
  version: '0.9.0',
  summary: 'Ethereum JavaScript API, middleware to talk to a ethreum node over RPC',
  git: 'https://github.com/ethereum/ethereum.js',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0.3.2');

  // api.use('3stack:bignumber@2.0.0', 'client');

  api.export(['web3', 'BigNumber'], ['client', 'server']);

  api.addFiles('dist/web3.js', 'client');
  api.addFiles('package-init.js', 'client');
});

// Package.onTest(function(api) {
//   api.use('tinytest');
//   api.use('test');
//   api.addFiles('test-tests.js');
// });
/* jshint ignore:end */
