const baseDocConfig = require('./base.config.js');

module.exports = {
	...baseDocConfig,

	entryPoints: [
		'./packages/web3-eth/src/web3_eth.ts',
		'./packages/web3-eth-accounts/src/wallet.ts',
		'./packages/web3-eth-accounts/src/account.ts',
		'./packages/web3-eth-contract/src/contract.ts',
		'./packages/web3-eth-ens/src/ens.ts',
		'./packages/web3-eth-iban/src/iban.ts',
		'./packages/web3-eth-personal/src/personal.ts',
		'./packages/web3-net/src/net.ts',
		'./packages/web3-account-abstraction/src/web3_aa.ts',
	],

	excludeCategories: 'ContractEvent', // for exluding being in module.md file and invalid link in contract.md
	mergeModulesMergeMode: 'project', // NEW option of TypeDoc added by typedoc-plugin-merge-modules plugin
};
