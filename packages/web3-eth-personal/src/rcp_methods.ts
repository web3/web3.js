import { Transaction } from 'web3-eth';
import { Address, HexString } from 'web3-utils';
import { EthPersonalAPIManager } from './types';

export const getAccounts = async (requestManager: EthPersonalAPIManager) =>
	requestManager.send({
		method: 'personal_listAccounts',
		params: [],
	});

export const newAccount = async (requestManager: EthPersonalAPIManager, password: string) =>
	requestManager.send({
		method: 'personal_newAccount',
		params: [password],
	});

export const unlockAccount = async (
	requestManager: EthPersonalAPIManager,
	address: Address,
	password: string,
	unlockDuration: number,
) =>
	requestManager.send({
		method: 'personal_unlockAccount',
		params: [address, password, unlockDuration],
	});

export const lockAccount = async (requestManager: EthPersonalAPIManager, address: Address) =>
	requestManager.send({
		method: 'personal_lockAccount',
		params: [address],
	});

export const importRawKey = async (
	requestManager: EthPersonalAPIManager,
	keyData: HexString,
	passphrase: string,
) =>
	requestManager.send({
		method: 'personal_importRawKey',
		params: [keyData, passphrase],
	});

export const sendTransaction = async (
	requestManager: EthPersonalAPIManager,
	tx: Transaction,
	passphrase: string,
) =>
	requestManager.send({
		method: 'personal_sendTransaction',
		params: [tx, passphrase],
	});

export const signTransaction = async (
	requestManager: EthPersonalAPIManager,
	tx: Transaction,
	passphrase: string,
) =>
	requestManager.send({
		method: 'personal_signTransaction',
		params: [tx, passphrase],
	});

export const sign = async (
	requestManager: EthPersonalAPIManager,
	data: HexString,
	address: Address,
	passphrase: string,
) =>
	requestManager.send({
		method: 'personal_sign',
		params: [data, address, passphrase],
	});

export const ecRecover = async (
	requestManager: EthPersonalAPIManager,
	signedData: HexString,
	signature: string,
) =>
	requestManager.send({
		method: 'personal_ecRecover',
		params: [signedData, signature],
	});
