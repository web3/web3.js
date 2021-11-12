import { Block } from 'web3-common';

type Modify<T, R> = Omit<T, keyof R> & R;

export type VariablyTypedBlock<ReturnType = string | number | bigint> = Modify<
	Block,
	{
		readonly difficulty?: ReturnType;
		readonly number: ReturnType | null;
		readonly gasLimit: ReturnType;
		readonly gasUsed: ReturnType;
		readonly timestamp: ReturnType;
		readonly nonce: ReturnType | null;
		readonly totalDifficulty: ReturnType;
		readonly baseFeePerGas?: ReturnType;
		readonly size: ReturnType;
	}
>;
