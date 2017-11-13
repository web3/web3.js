Package.describe({
    name: 'ethereum:web3',
    version: '1.0.0-beta.24',
    summary: 'Ethereum JavaScript API, middleware to talk to an Ethereum node over RPC',
    git: 'https://github.com/ethereum/web3.js'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.3.2');

    api.addFiles('dist/web3.js', ['client']); // 'server'
});
