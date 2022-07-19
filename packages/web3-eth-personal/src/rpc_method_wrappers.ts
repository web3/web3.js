/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import { ETH_DATA_FORMAT, isHexStrict, toChecksumAddress, utf8ToHex } from 'web3-utils';
import { formatTransaction } from 'web3-eth';
import { Address, HexString, Transaction } from 'web3-types';
import { validator } from 'web3-validator';
import {
	getAccounts as rpcGetAccounts,
	lockAccount as rpcLockAccount,
	newAccount as rpcNewAccount,
	unlockAccount as rpcUnlockAccount,
	importRawKey as rpcImportRawKey,
	sendTransaction as rpcSendTransaction,
	signTransaction as rpcSignTransaction,
	sign as rpcSign,
	ecRecover as rpcEcRecover,
} from './rcp_methods';
import { EthPersonalAPIManager } from './types';

export const getAccounts = async (requestManager: EthPersonalAPIManager) => {
	const result = await rpcGetAccounts(requestManager);

	return result.map(toChecksumAddress);
};

export const newAccount = async (requestManager: EthPersonalAPIManager, password: string) => {
	validator.validate(['string'], [password]);

	const result = await rpcNewAccount(requestManager, password);

	return toChecksumAddress(result);
};

export const unlockAccount = async (
	requestManager: EthPersonalAPIManager,
	address: Address,
	password: string,
	unlockDuration: number,
) => {
	validator.validate(['address', 'string', 'uint'], [address, password, unlockDuration]);

	return rpcUnlockAccount(requestManager, address, password, unlockDuration);
};

export const lockAccount = async (requestManager: EthPersonalAPIManager, address: Address) => {
	validator.validate(['address'], [address]);

	return rpcLockAccount(requestManager, address);
};

export const importRawKey = async (
	requestManager: EthPersonalAPIManager,
	keyData: HexString,
	passphrase: string,
) => {
	validator.validate(['string', 'string'], [keyData, passphrase]);

	return rpcImportRawKey(requestManager, keyData, passphrase);
};

export const sendTransaction = async (
	requestManager: EthPersonalAPIManager,
	tx: Transaction,
	passphrase: string,
) => {
	const formattedTx = formatTransaction(tx, ETH_DATA_FORMAT);

	return rpcSendTransaction(requestManager, formattedTx, passphrase);
};

export const signTransaction = async (
	requestManager: EthPersonalAPIManager,
	tx: Transaction,
	passphrase: string,
) => {
	const formattedTx = formatTransaction(tx, ETH_DATA_FORMAT);

	return rpcSignTransaction(requestManager, formattedTx, passphrase);
};

export const sign = async (
	requestManager: EthPersonalAPIManager,
	data: HexString,
	address: Address,
	passphrase: string,
) => {
	validator.validate(['string', 'address', 'string'], [data, address, passphrase]);

	const dataToSign = isHexStrict(data) ? data : utf8ToHex(data);

	return rpcSign(requestManager, dataToSign, address, passphrase);
};

export const ecRecover = async (
	requestManager: EthPersonalAPIManager,
	signedData: HexString,
	signature: string,
) => {
	validator.validate(['string', 'string'], [signedData, signature]);

	const signedDataString = isHexStrict(signedData) ? signedData : utf8ToHex(signedData);

	return rpcEcRecover(requestManager, signedDataString, signature);
};
