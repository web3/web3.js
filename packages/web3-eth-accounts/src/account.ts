import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import {
	TransactionFactory,
	FeeMarketEIP1559TxData,
	AccessListEIP2930TxData,
	TxData,
} from '@ethereumjs/tx';
import { ecdsaSign, ecdsaRecover } from 'secp256k1';
import {
	toChecksumAddress,
	bytesToHex,
	sha3Raw,
	HexString,
	isBuffer,
	isValidString,
	Address,
	isHexStrict,
	utf8ToHex,
	hexToBytes,
} from 'web3-utils';
import { InvalidPrivateKeyError, PrivateKeyLengthError } from 'web3-common';
import {
	signatureObject,
	signFunction,
	signResult,
	signTransactionFunction,
	signTransactionResult,
} from './types';

// TODO Will be added later
export const encrypt = (): boolean => true;

/**
 * Hashes the given message. The data will be UTF-8 HEX decoded and enveloped as follows: "\x19Ethereum Signed Message:\n" + message.length + message and hashed using keccak256.
 */

export const hashMessage = (message: string): string => {
	const messageHex = isHexStrict(message) ? message : utf8ToHex(message);

	const messageBytes = hexToBytes(messageHex);

	const preamble = `\x19Ethereum Signed Message:\n${messageBytes.length}`;

	const ethMessage = Buffer.concat([Buffer.from(preamble), Buffer.from(messageBytes)]);

	return `0x${Buffer.from(keccak256(ethMessage)).toString('hex')}`;
};

/**
 * Signs arbitrary data. The value passed as the data parameter will be UTF-8 HEX decoded and wrapped as follows: "\x19Ethereum Signed Message:\n" + message.length + message
 */
export const sign = (data: string, privateKey: string): signResult => {
	// 64 hex characters + hex-prefix
	if (privateKey.length !== 66) {
		throw new PrivateKeyLengthError();
	}

	const hash = hashMessage(data);

	const signObj = ecdsaSign(
		Buffer.from(hash.substring(2), 'hex'),
		Buffer.from(privateKey.substring(2), 'hex'),
	);

	const r = Buffer.from(signObj.signature.slice(0, 32));
	const s = Buffer.from(signObj.signature.slice(32, 64));
	const v = signObj.recid + 27;

	return {
		message: data,
		messageHash: hash,
		v: `0x${v.toString(16)}`,
		r: `0x${r.toString('hex')}`,
		s: `0x${s.toString('hex')}`,
		signature: `0x${Buffer.from(signObj.signature).toString('hex')}${v.toString(16)}`,
	};
};

/**
 *  Signs an Ethereum transaction with a given private key.
 */
export const signTransaction = (
	transaction: TxData | AccessListEIP2930TxData | FeeMarketEIP1559TxData,
	privateKey: string,
): signTransactionResult => {
	//	TO DO : Send calls to web3.transaction package for :
	//		Transaction Validation checks

	const tx = TransactionFactory.fromTxData(transaction);
	const signedTx = tx.sign(Buffer.from(privateKey.substring(2), 'hex'));
	if (signedTx.v === undefined || signedTx.r === undefined || signedTx.s === undefined)
		throw new Error('Signer Error');

	const validationErrors = signedTx.validate(true);

	if (validationErrors.length > 0) {
		let errorString = 'Signer Error: ';
		for (const validationError of validationErrors) {
			errorString += `${errorString} ${validationError}.`;
		}
		throw new Error(errorString);
	}

	const rlpEncoded = signedTx.serialize().toString('hex');
	const rawTx = `0x${rlpEncoded}`;
	const txHash = keccak256(Buffer.from(rawTx, 'hex'));

	return {
		messageHash: `0x${Buffer.from(signedTx.getMessageToSign(true)).toString('hex')}`,
		v: `0x${signedTx.v.toString('hex')}`,
		r: `0x${signedTx.r.toString('hex')}`,
		s: `0x${signedTx.s.toString('hex')}`,
		rawTransaction: rawTx,
		transactionHash: `0x${Buffer.from(txHash).toString('hex')}`,
	};
};

/**
 * Recovers the Ethereum address which was used to sign the given RLP encoded transaction.
 */
export const recoverTransaction = (rawTransaction: string): Address => {
	if (rawTransaction === undefined) throw new Error('Invalid rawTransaction');

	const tx = TransactionFactory.fromSerializedData(Buffer.from(rawTransaction.slice(2), 'hex'));

	return toChecksumAddress(tx.getSenderAddress().toString());
};

/**
 * Recovers the Ethereum address which was used to sign the given data
 */
export const recover = (
	data: string | signatureObject,
	signature?: string,
	hashed?: boolean,
): Address => {
	if (typeof data === 'object') {
		const signatureStr = `${data.r}${data.s.slice(2)}${data.v.slice(2)}`;
		return recover(data.messageHash, signatureStr, true);
	}

	if (signature === undefined) throw new Error('signature string undefined');

	const hashedMessage = hashed ? data : hashMessage(data);

	const v = signature.substring(130); // 0x + r + s + v

	const ecPublicKey = ecdsaRecover(
		Buffer.from(signature.substring(2, 130), 'hex'),
		parseInt(v, 16) - 27,
		Buffer.from(hashedMessage.substring(2), 'hex'),
		false,
	);

	const publicKey = `0x${Buffer.from(ecPublicKey).toString('hex').slice(2)}`;

	const publicHash = sha3Raw(publicKey);

	const address = toChecksumAddress(`0x${publicHash.slice(-40)}`);

	return address;
};

/**
 * Get account from private key
 */
export const privateKeyToAccount = (
	privateKey: string | Buffer,
): {
	address: string;
	privateKey: string;
	signTransaction: signTransactionFunction; // From 1.x
	sign: signFunction;
	encrypt: () => boolean;
} => {
	if (!(isValidString(privateKey) || isBuffer(privateKey))) {
		throw new InvalidPrivateKeyError();
	}

	const stringPrivateKey = Buffer.isBuffer(privateKey)
		? Buffer.from(privateKey).toString('hex')
		: privateKey;

	const stringPrivateKeyNoPrefix = stringPrivateKey.startsWith('0x')
		? stringPrivateKey.slice(2)
		: stringPrivateKey;

	// TODO Replace with isHexString32Bytes function in web3-eth PR:
	// Must be 64 hex characters
	if (stringPrivateKeyNoPrefix.length !== 64) {
		throw new PrivateKeyLengthError();
	}

	const publicKey = getPublicKey(stringPrivateKeyNoPrefix);

	const publicKeyString = `0x${publicKey.slice(2)}`;
	const publicHash = sha3Raw(publicKeyString);
	const publicHashHex = bytesToHex(publicHash);
	const address = toChecksumAddress(publicHashHex.slice(-40)); // To get the address, take the last 20 bytes of the public hash
	return { address, privateKey: stringPrivateKey, signTransaction, sign, encrypt };
};

/**
 * Returns an acoount
 */
export const create = (): {
	address: HexString;
	privateKey: string;
	signTransaction: signTransactionFunction; // From 1.x
	sign: signFunction;
	encrypt: () => boolean;
} => {
	const privateKey = utils.randomPrivateKey();

	return privateKeyToAccount(`0x${Buffer.from(privateKey).toString('hex')}`);
};
