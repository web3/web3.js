import { AccessList } from 'web3-common';
import { Address, HexString, Numbers } from 'web3-utils';

export enum ChainNames {
	MAINNET = 'mainnet',
	GOERLI = 'goerli',
	KOVAN = 'kovan',
	RINKEBY = 'rinkeby',
	ROPSTEN = 'ropsten',
}

export enum HardForks {
	CHAIN_START = 'chainstart',
	HOMESTEAD = 'homestead',
	DAO = 'dao',
	TANGERINE_WHISTLE = 'tangerineWhistle',
	SPURIOUS_DRAGON = 'spuriousDragon',
	BYZANTIUM = 'byzantium',
	CONSTANTINOPLE = 'constantinople',
	PETERSBURG = 'petersburg',
	ISTANBUL = 'istanbul',
	BERLIN = 'berlin',
	LONDON = 'london',
}

export interface Transaction {
	from?: Address;
	to?: Address;
	value?: Numbers;
	gas?: Numbers;
	gasPrice?: Numbers;
	type?: Numbers;
	maxFeePerGas?: Numbers;
	maxPriorityFeePerGas?: Numbers;
	accessList?: AccessList;
	data?: HexString;
	nonce?: Numbers;
	chain?: HexString;
	hardfork?: HexString;
	common?: {
		customChain: {
			name?: string;
			networkId: Numbers;
			chainId: Numbers;
		};
		baseChain?: ChainNames;
		hardfork?: HardForks;
	};
}
