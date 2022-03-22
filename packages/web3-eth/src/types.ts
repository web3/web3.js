import {
	AccessList,
	Log,
	ReceiptInfo,
	TransactionHash,
	TransactionInfo,
	Uncles,
} from 'web3-common';
import {
	Address,
	HexString,
	HexString256Bytes,
	HexString32Bytes,
	HexStringBytes,
	Numbers,
	Uint,
	ValidReturnTypes,
	ValidTypes,
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
	to?: Address | null;
	value?: NumberType;
	gas?: NumberType;
	gasPrice?: NumberType;
	type?: NumberType;
	maxFeePerGas?: NumberType;
	maxPriorityFeePerGas?: NumberType;
	accessList?: AccessList;
	data?: HexStringBytes;
	input?: HexStringBytes;
	nonce?: NumberType;
	chain?: chain;
	hardfork?: hardfork;
	chainId?: NumberType;
	networkId?: NumberType;
	common?: Common<NumberType>;
	gasLimit?: NumberType;
	v?: NumberType;
	r?: HexString;
	s?: HexString;
}

export interface TransactionCall<NumberType extends Numbers = Numbers>
	extends Transaction<NumberType> {
	to: Address;
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
	networkId: Numbers;
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
	readonly chainId?: ReturnType;
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
	readonly effectiveGasPrice: ReturnType;
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

export interface StorageProofFormatted<NumberType extends Numbers = Numbers> {
	readonly key: HexString32Bytes;
	readonly value: NumberType;
	readonly proof: HexString32Bytes[];
}

export interface AccountObjectFormatted<NumberType extends Numbers = Numbers> {
	readonly balance: NumberType;
	readonly codeHash: HexString32Bytes;
	readonly nonce: NumberType;
	readonly storageHash: HexString32Bytes;
	readonly accountProof: HexString32Bytes[];
	readonly storageProof: StorageProofFormatted<NumberType>[];
}

export type SendTransactionEvents = {
	sending: Transaction;
	sent: Transaction;
	transactionHash: HexString32Bytes;
	receipt: ReceiptInfo;
	confirmation: {
		confirmationNumber: number;
		receipt: ReceiptInfo;
		latestBlockHash: HexString32Bytes;
	};
};

export type SendSignedTransactionEvents = {
	sending: HexStringBytes;
	sent: HexStringBytes;
	transactionHash: HexString32Bytes;
	receipt: ReceiptInfo;
	confirmation: {
		confirmationNumber: number;
		receipt: ReceiptInfo;
		latestBlockHash: HexString32Bytes;
	};
};
