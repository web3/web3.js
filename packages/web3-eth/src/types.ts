import { AccessList, TransactionHash, TransactionInfo, Uncles } from 'web3-common';
import {
	Address,
	HexString,
	Numbers,
	ValidTypes,
	ValidReturnTypes,
	HexString32Bytes,
	HexString256Bytes,
	HexStringBytes,
} from 'web3-utils';

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

export interface BlockFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> {
	readonly parentHash: HexString32Bytes;
	readonly sha3Uncles: HexString32Bytes;
	readonly miner: HexString;
	readonly stateRoot: HexString32Bytes;
	readonly transactionsRoot: HexString32Bytes;
	readonly receiptsRoot: HexString32Bytes;
	readonly logsBloom: HexString256Bytes | null;
	readonly difficulty?: ReturnType;
	readonly number: ReturnType;
	readonly gasLimit: ReturnType;
	readonly gasUsed: ReturnType;
	readonly timestamp: ReturnType;
	readonly extraData: HexStringBytes;
	readonly mixHash: HexString32Bytes;
	readonly nonce: ReturnType;
	readonly totalDifficulty: ReturnType;
	readonly baseFeePerGas?: ReturnType;
	readonly size: ReturnType;
	readonly transactions: TransactionHash[] | TransactionInfo[];
	readonly uncles: Uncles;
	readonly hash: HexString32Bytes | null;
}
