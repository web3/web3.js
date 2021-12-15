import { AccessList, Log, TransactionHash, TransactionInfo, Uncles } from 'web3-common';
import {
	Address,
	HexString,
	Numbers,
	ValidTypes,
	ValidReturnTypes,
	HexString32Bytes,
	HexString256Bytes,
	HexStringBytes,
	Uint,
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
	input: HexStringBytes;
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

interface BaseTransactionFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> {
	readonly to?: Address | null;
	readonly type: ReturnType;
	readonly nonce: ReturnType;
	readonly gas: ReturnType;
	readonly value: ReturnType;
	readonly input: HexStringBytes;
}

interface Transaction1559UnsignedFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> extends BaseTransactionFormatted<DesiredType> {
	readonly maxFeePerGas: ReturnType;
	readonly maxPriorityFeePerGas: ReturnType;
	readonly accessList: AccessList;
}

interface Transaction1559SignedFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> extends Transaction1559UnsignedFormatted<DesiredType> {
	readonly yParity: ReturnType;
	readonly r: ReturnType;
	readonly s: ReturnType;
}

interface Transaction2930UnsignedFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> extends BaseTransactionFormatted<DesiredType> {
	readonly gasPrice: ReturnType;
	readonly accessList: AccessList;
}

interface Transaction2930SignedFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> extends Transaction2930UnsignedFormatted<DesiredType> {
	readonly yParity: ReturnType;
	readonly r: ReturnType;
	readonly s: ReturnType;
}

interface TransactionLegacyUnsignedFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> extends BaseTransactionFormatted<DesiredType> {
	readonly gasPrice: ReturnType;
}

interface TransactionLegacySignedFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> extends TransactionLegacyUnsignedFormatted<DesiredType> {
	readonly v: ReturnType;
	readonly r: Uint;
	readonly s: Uint;
}

type TransactionSignedFormatted<DesiredType extends ValidTypes = ValidTypes.HexString> =
	| Transaction1559SignedFormatted<DesiredType>
	| Transaction2930SignedFormatted<DesiredType>
	| TransactionLegacySignedFormatted<DesiredType>;

export type TransactionInfoFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> = TransactionSignedFormatted<DesiredType> & {
	readonly blockHash: HexString32Bytes | null;
	readonly blockNumber: ReturnType | null;
	readonly from: Address;
	readonly hash: HexString32Bytes;
	readonly transactionIndex: ReturnType | null;
};

export interface ReceiptInfoFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> {
	readonly transactionHash: HexString32Bytes;
	readonly transactionIndex: ReturnType;
	readonly blockHash: HexString32Bytes;
	readonly blockNumber: ReturnType;
	readonly from: Address;
	readonly to: Address;
	readonly cumulativeGasUsed: ReturnType;
	readonly gasUsed: ReturnType;
	readonly contractAddress: Address | null;
	readonly logs: Log[];
	readonly logsBloom: HexString256Bytes;
	readonly root: HexString32Bytes;
	readonly status: ReturnType;
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

export interface FeeHistoryResultFormatted<
	DesiredType extends ValidTypes = ValidTypes.HexString,
	ReturnType = ValidReturnTypes[DesiredType],
> {
	readonly oldestBlock: ReturnType;
	readonly baseFeePerGas: ReturnType;
	readonly reward: number[][];
}
