import { FeeMarketEIP1559TxData, AccessListEIP2930TxData, TxData } from '@ethereumjs/tx';

export type signatureObject = {
	messageHash: string;
	r: string;
	s: string;
	v: string;
};

export type signTransactionResult = signatureObject & {
	rawTransaction: string;
	transactionHash: string;
};

export type signTransactionFunction = (
	transaction: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData,
	privateKey: string,
) => signTransactionResult;

export type signResult = signatureObject & {
	message?: string;
	signature: string;
};

export type signFunction = (data: string, privateKey: string) => signResult;
