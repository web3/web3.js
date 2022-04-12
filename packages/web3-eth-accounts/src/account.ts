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

import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import {
	TransactionFactory,
	FeeMarketEIP1559TxData,
	AccessListEIP2930TxData,
	TxData,
} from '@ethereumjs/tx';
import { ecdsaSign, ecdsaRecover } from 'secp256k1';
import { pbkdf2Sync } from 'ethereum-cryptography/pbkdf2';
import { scryptSync } from 'ethereum-cryptography/scrypt';
import { encrypt as createCipheriv, decrypt as createDecipheriv } from 'ethereum-cryptography/aes';
import {
	toChecksumAddress,
	bytesToHex,
	sha3Raw,
	HexString,
	randomBytes,
	hexToBytes,
	Address,
	isHexStrict,
	utf8ToHex,
} from 'web3-utils';
import { validator, isBuffer, isHexString32Bytes, isString } from 'web3-validator';
import {
	InvalidPrivateKeyError,
	PrivateKeyLengthError,
	UndefinedRawTransactionError,
	SignerError,
	InvalidSignatureError,
	InvalidKdfError,
	KeyDerivationError,
	KeyStoreVersionError,
	InvalidPasswordError,
	IVLengthError,
	PBKDF2IterationsError,
} from 'web3-common';
import {
	signatureObject,
	signResult,
	signTransactionResult,
	KeyStore,
	ScryptParams,
	PBKDF2SHA256Params,
	CipherOptions,
	keyStoreSchema,
	Web3Account,
} from './types';

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
export const sign = (data: string, privateKey: HexString): signResult => {
	const privateKeyParam = privateKey.startsWith('0x') ? privateKey.substring(2) : privateKey;

	if (!isHexString32Bytes(privateKeyParam, false)) {
		throw new PrivateKeyLengthError();
	}

	const hash = hashMessage(data);

	const signObj = ecdsaSign(
		Buffer.from(hash.substring(2), 'hex'),
		Buffer.from(privateKeyParam, 'hex'),
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
	privateKey: HexString,
): signTransactionResult => {
	//	TODO : Send calls to web3.transaction package for :
	//		Transaction Validation checks

	const tx = TransactionFactory.fromTxData(transaction);
	const signedTx = tx.sign(Buffer.from(privateKey.substring(2), 'hex'));
	if (signedTx.v === undefined || signedTx.r === undefined || signedTx.s === undefined)
		throw new SignerError('Signer Error');

	const validationErrors = signedTx.validate(true);

	if (validationErrors.length > 0) {
		let errorString = 'Signer Error ';
		for (const validationError of validationErrors) {
			errorString += `${errorString} ${validationError}.`;
		}
		throw new SignerError(errorString);
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
export const recoverTransaction = (rawTransaction: HexString): Address => {
	if (rawTransaction === undefined) throw new UndefinedRawTransactionError();

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

	if (signature === undefined) throw new InvalidSignatureError('signature string undefined');

	const V_INDEX = 130; // r = first 32 bytes, s = second 32 bytes, v = last byte of signature
	const hashedMessage = hashed ? data : hashMessage(data);

	const v = signature.substring(V_INDEX); // 0x + r + s + v

	const ecPublicKey = ecdsaRecover(
		Buffer.from(signature.substring(2, V_INDEX), 'hex'),
		parseInt(v, 16) - 27,
		Buffer.from(hashedMessage.substring(2), 'hex'),
		false,
	);

	const publicKey = `0x${Buffer.from(ecPublicKey).toString('hex').slice(2)}`;

	const publicHash = sha3Raw(publicKey);

	const address = toChecksumAddress(`0x${publicHash.slice(-40)}`);

	return address;
};

// Generate a version 4 uuid
// https://github.com/uuidjs/uuid/blob/main/src/v4.js#L5
// https://github.com/ethers-io/ethers.js/blob/ce8f1e4015c0f27bf178238770b1325136e3351a/packages/json-wallets/src.ts/utils.ts#L54
const uuidV4 = () => {
	const bytes = randomBytes(16);

	// Section: 4.1.3:
	// - time_hi_and_version[12:16] = 0b0100
	/* eslint-disable-next-line */
	bytes[6] = (bytes[6] & 0x0f) | 0x40;

	// Section 4.4
	// - clock_seq_hi_and_reserved[6] = 0b0
	// - clock_seq_hi_and_reserved[7] = 0b1
	/* eslint-disable-next-line */
	bytes[8] = (bytes[8] & 0x3f) | 0x80;

	const hexString = bytesToHex(bytes);

	return [
		hexString.substring(2, 10),
		hexString.substring(10, 14),
		hexString.substring(14, 18),
		hexString.substring(18, 22),
		hexString.substring(22, 34),
	].join('-');
};

export const privateKeyToAddress = (privateKey: string | Buffer): string => {
	if (!(isString(privateKey) || isBuffer(privateKey))) {
		throw new InvalidPrivateKeyError();
	}

	const stringPrivateKey = Buffer.isBuffer(privateKey)
		? Buffer.from(privateKey).toString('hex')
		: privateKey;

	const stringPrivateKeyNoPrefix = stringPrivateKey.startsWith('0x')
		? stringPrivateKey.slice(2)
		: stringPrivateKey;

	if (!isHexString32Bytes(stringPrivateKeyNoPrefix, false)) {
		throw new PrivateKeyLengthError();
	}

	const publicKey = getPublicKey(stringPrivateKeyNoPrefix);

	const publicKeyString = `0x${publicKey.slice(2)}`;
	const publicHash = sha3Raw(publicKeyString);
	const publicHashHex = bytesToHex(publicHash);
	return toChecksumAddress(publicHashHex.slice(-40)); // To get the address, take the last 20 bytes of the public hash
};

/**
 * encrypt a private key given a password, returns a V3 JSON Keystore
 * https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 */
export const encrypt = async (
	privateKey: HexString,
	password: string | Buffer,
	options?: CipherOptions,
): Promise<KeyStore> => {
	if (!(isString(privateKey) || isBuffer(privateKey))) {
		throw new InvalidPrivateKeyError();
	}

	const stringPrivateKey = Buffer.isBuffer(privateKey)
		? Buffer.from(privateKey).toString('hex')
		: privateKey;

	if (!isHexString32Bytes(stringPrivateKey)) {
		throw new PrivateKeyLengthError();
	}

	// if given salt or iv is a string, convert it to a Uint8Array
	let salt;
	if (options?.salt) {
		salt = typeof options.salt === 'string' ? Buffer.from(options.salt, 'hex') : options.salt;
	} else {
		salt = randomBytes(32);
	}

	if (!(isString(password) || isBuffer(password))) {
		throw new InvalidPasswordError();
	}

	const bufferPassword = typeof password === 'string' ? Buffer.from(password) : password;

	let initializationVector;
	if (options?.iv) {
		initializationVector =
			typeof options.iv === 'string' ? Buffer.from(options.iv, 'hex') : options.iv;
		if (initializationVector.toString('hex').length !== 32) {
			throw new IVLengthError();
		}
	} else {
		initializationVector = randomBytes(16);
	}

	const kdf = options?.kdf ?? 'scrypt';

	let derivedKey;
	let kdfparams: ScryptParams | PBKDF2SHA256Params;

	// derive key from key derivation function
	if (kdf === 'pbkdf2') {
		kdfparams = {
			dklen: options?.dklen ?? 32,
			salt: salt.toString('hex'),
			c: options?.c ?? 262144,
			prf: 'hmac-sha256',
		};

		if (kdfparams.c < 1000) {
			// error when c < 1000, pbkdf2 is less secure with less iterations
			throw new PBKDF2IterationsError();
		}
		derivedKey = pbkdf2Sync(
			bufferPassword,
			Buffer.from(salt),
			kdfparams.c,
			kdfparams.dklen,
			'sha256',
		);
	} else if (kdf === 'scrypt') {
		kdfparams = {
			n: options?.n ?? 8192,
			r: options?.r ?? 8,
			p: options?.p ?? 1,
			dklen: options?.dklen ?? 32,
			salt: salt.toString('hex'),
		};
		derivedKey = scryptSync(
			bufferPassword,
			Buffer.from(salt),
			kdfparams.n,
			kdfparams.p,
			kdfparams.r,
			kdfparams.dklen,
		);
	} else {
		throw new InvalidKdfError();
	}

	const cipherKey = Buffer.from(stringPrivateKey.replace('0x', ''), 'hex');

	const cipher = await createCipheriv(
		cipherKey,
		Buffer.from(derivedKey.slice(0, 16)),
		initializationVector,
		'aes-128-ctr',
	);

	const ciphertext = bytesToHex(cipher).slice(2);

	const mac = sha3Raw(Buffer.from([...derivedKey.slice(16, 32), ...cipher])).replace('0x', '');

	return {
		version: 3,
		id: uuidV4(),
		address: privateKeyToAddress(stringPrivateKey).toLowerCase().replace('0x', ''),
		crypto: {
			ciphertext,
			cipherparams: {
				iv: initializationVector.toString('hex'),
			},
			cipher: 'aes-128-ctr',
			kdf,
			kdfparams,
			mac,
		},
	};
};

/**
 * Get account from private key
 */
export const privateKeyToAccount = (privateKey: string | Buffer): Web3Account => {
	const pKey = Buffer.isBuffer(privateKey) ? Buffer.from(privateKey).toString('hex') : privateKey;

	return {
		address: privateKeyToAddress(pKey),
		privateKey: pKey,
		signTransaction: (tx: Record<string, unknown>) => signTransaction(tx, pKey),
		sign: (data: Record<string, unknown> | string) =>
			sign(typeof data === 'string' ? data : JSON.stringify(data), pKey),
		encrypt: async (password: string, options?: Record<string, unknown>) => {
			const data = await encrypt(pKey, password, options);

			return JSON.stringify(data);
		},
	};
};

/**
 * Returns an acoount
 */
export const create = (): Web3Account => {
	const privateKey = utils.randomPrivateKey();

	return privateKeyToAccount(`0x${Buffer.from(privateKey).toString('hex')}`);
};

/**
 *  Decrypts a v3 keystore JSON, and creates the account.
 *
 * */
export const decrypt = async (
	keystore: KeyStore | string,
	password: string | Buffer,
	nonStrict?: boolean,
): Promise<Web3Account> => {
	const json =
		typeof keystore === 'object'
			? keystore
			: (JSON.parse(nonStrict ? keystore.toLowerCase() : keystore) as KeyStore);

	validator.validateJSONSchema(keyStoreSchema, json);

	if (json.version !== 3) throw new KeyStoreVersionError();

	const bufferPassword = typeof password === 'string' ? Buffer.from(password) : password;

	validator.validate(['bytes'], [bufferPassword]);

	let derivedKey;
	if (json.crypto.kdf === 'scrypt') {
		const kdfparams = json.crypto.kdfparams as ScryptParams;
		const bufferSalt =
			typeof kdfparams.salt === 'string'
				? Buffer.from(kdfparams.salt, 'hex')
				: kdfparams.salt;
		derivedKey = scryptSync(
			bufferPassword,
			bufferSalt,
			kdfparams.n,
			kdfparams.p,
			kdfparams.r,
			kdfparams.dklen,
		);
	} else if (json.crypto.kdf === 'pbkdf2') {
		const kdfparams: PBKDF2SHA256Params = json.crypto.kdfparams as PBKDF2SHA256Params;

		const bufferSalt =
			typeof kdfparams.salt === 'string'
				? Buffer.from(kdfparams.salt, 'hex')
				: kdfparams.salt;

		derivedKey = pbkdf2Sync(bufferPassword, bufferSalt, kdfparams.c, kdfparams.dklen, 'sha256');
	} else {
		throw new InvalidKdfError();
	}

	const ciphertext = hexToBytes(`0X${json.crypto.ciphertext}`);
	const mac = sha3Raw(Buffer.from([...derivedKey.slice(16, 32), ...ciphertext])).replace(
		'0x',
		'',
	);

	if (mac !== json.crypto.mac) {
		throw new KeyDerivationError();
	}

	const seed = await createDecipheriv(
		Buffer.from(json.crypto.ciphertext, 'hex'),
		derivedKey.slice(0, 16),
		Buffer.from(json.crypto.cipherparams.iv, 'hex'),
	);

	return privateKeyToAccount(Buffer.from(seed));
};
