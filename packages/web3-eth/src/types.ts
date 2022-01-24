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
} from 'web3-utils';

export type chain = 'goerli' | 'kovan' | 'mainnet' | 'rinkeby' | 'ropsten' | 'sepolia';
export type hardfork =
	| 'arrowGlacier'
	| 'berlin'
	| 'byzantium'
	| 'chainstart'
	| 'constantinople'
	| 'dao'
	| 'homestead'
	| 'istanbul'
	| 'london'
	| 'merge'
	| 'muirGlacier'
	| 'petersburg'
	| 'shanghai'
	| 'spuriousDragon'
	| 'tangerineWhistle';

export interface CustomChain<NumberType = Numbers> {
	name?: string;
	networkId: NumberType;
	chainId: NumberType;
}

export interface Common<NumberType = Numbers> {
	customChain: CustomChain<NumberType>;
	baseChain?: chain;
	hardfork?: hardfork;
}

export interface Transaction<NumberType extends Numbers = Numbers> {
	from?: Address;
	to?: Address;
	value?: NumberType;
	gas?: NumberType;
	gasPrice?: NumberType;
	type?: NumberType;
	maxFeePerGas?: NumberType;
	maxPriorityFeePerGas?: NumberType;
	accessList?: AccessList;
	data?: HexStringBytes;
	nonce?: NumberType;
	chain?: chain;
	hardfork?: hardfork;
	chainId?: NumberType;
	common?: Common<NumberType>;
	gasLimit?: NumberType;
	v?: NumberType;
	r?: HexString;
	s?: HexString;
}

export interface PopulatedUnsignedBaseTransaction<NumberType extends Numbers = Numbers> {
	from: Address;
	to?: Address;
	value: Numbers;
	gas?: Numbers;
	gasPrice: Numbers;
	type: Numbers;
	data: HexStringBytes;
	nonce: Numbers;
	chain: chain;
	hardfork: hardfork;
	chainId: Numbers;
	common: Common<NumberType>;
	gasLimit: Numbers;
}
export interface PopulatedUnsignedEip2930Transaction<NumberType extends Numbers = Numbers>
	extends PopulatedUnsignedBaseTransaction<NumberType> {
	accessList: AccessList;
}
export interface PopulatedUnsignedEip1559Transaction<NumberType extends Numbers = Numbers>
	extends PopulatedUnsignedEip2930Transaction<NumberType> {
	gasPrice: never;
	maxFeePerGas: NumberType;
	maxPriorityFeePerGas: NumberType;
}
export type PopulatedUnsignedTransaction<NumberType extends Numbers = Numbers> =
	| PopulatedUnsignedBaseTransaction<NumberType>
	| PopulatedUnsignedEip2930Transaction<NumberType>
	| PopulatedUnsignedEip1559Transaction<NumberType>;

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
