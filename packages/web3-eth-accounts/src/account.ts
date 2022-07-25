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

import { TransactionFactory, TypedTransaction } from '@ethereumjs/tx';
import { decrypt as createDecipheriv, encrypt as createCipheriv } from 'ethereum-cryptography/aes';
import { pbkdf2Sync } from 'ethereum-cryptography/pbkdf2';
import { scryptSync } from 'ethereum-cryptography/scrypt';
import { getPublicKey, recoverPublicKey, signSync, utils } from 'ethereum-cryptography/secp256k1';
import {
	InvalidKdfError,
	InvalidPasswordError,
	InvalidPrivateKeyError,
	InvalidSignatureError,
	IVLengthError,
	KeyDerivationError,
	KeyStoreVersionError,
	PBKDF2IterationsError,
	PrivateKeyLengthError,
	SignerError,
	UndefinedRawTransactionError,
} from 'web3-errors';
import { Address, Bytes, HexString } from 'web3-types';
import {
	bytesToBuffer,
	bytesToHex,
	hexToBytes,
	isHexStrict,
	numberToHex,
	randomBytes,
	sha3Raw,
	toChecksumAddress,
	utf8ToHex,
} from 'web3-utils';
import { isBuffer, isNullish, isString, validator } from 'web3-validator';
import { keyStoreSchema } from './schemas';
import {
	CipherOptions,
	KeyStore,
	PBKDF2SHA256Params,
	ScryptParams,
	SignatureObject,
	SignResult,
	SignTransactionResult,
	Web3Account,
} from './types';

/**
 * Get the private key buffer after the validation
 */
export const parseAndValidatePrivateKey = (data: Bytes, ignoreLength?: boolean): Buffer => {
	let privateKeyBuffer: Buffer;

	// To avoid the case of 1 character less in a hex string which is prefixed with '0' by using 'bytesToBuffer'
	if (!ignoreLength && typeof data === 'string' && isHexStrict(data) && data.length !== 66) {
		throw new PrivateKeyLengthError();
	}

	try {
		privateKeyBuffer = Buffer.isBuffer(data) ? data : bytesToBuffer(data);
	} catch {
		throw new InvalidPrivateKeyError();
	}

	if (!ignoreLength && privateKeyBuffer.byteLength !== 32) {
		throw new PrivateKeyLengthError();
	}

	return privateKeyBuffer;
};

/**
 *
 * Hashes the given message. The data will be UTF-8 HEX decoded and enveloped as follows: "\\x19Ethereum Signed Message:\\n" + message.length + message and hashed using keccak256.
 *
 * @param message - A message to hash, if its HEX it will be UTF8 decoded.
 * @returns The hashed message
 *
 * ```ts
 * hashMessage("Hello world")
 * > "0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede"
 * hashMessage(utf8ToHex("Hello world")) // Will be hex decoded in hashMessage
 * > "0x8144a6fa26be252b86456491fbcd43c1de7e022241845ffea1c3df066f7cfede"
 * ```
 */
export const hashMessage = (message: string): string => {
	const messageHex = isHexStrict(message) ? message : utf8ToHex(message);

	const messageBytes = hexToBytes(messageHex);

	const preamble = Buffer.from(
		`\x19Ethereum Signed Message:\n${messageBytes.byteLength}`,
		'utf8',
	);

	const ethMessage = Buffer.concat([preamble, messageBytes]);

	return sha3Raw(ethMessage); // using keccak in web3-utils.sha3Raw instead of SHA3 (NIST Standard) as both are different
};

/**
 * Signs arbitrary data.
 * **_NOTE:_** The value passed as the data parameter will be UTF-8 HEX decoded and wrapped as follows: "\\x19Ethereum Signed Message:\\n" + message.length + message
 *
 * @param data - The data to sign
 * @param privateKey - The 32 byte private key to sign with
 * @returns The signature Object containing the message, messageHash, signature r, s, v
 *
 * ```ts
 * web3.eth.accounts.sign('Some data', '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
 * > {
 * message: 'Some data',
 * messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
 * v: '0x1c',
 * r: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
 * s: '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029',
 * signature: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c'
 * }
 * ```
 */
export const sign = (data: string, privateKey: Bytes): SignResult => {
	const privateKeyBuffer = parseAndValidatePrivateKey(privateKey);

	const hash = hashMessage(data);

	const [signature, recoverId] = signSync(hash.substring(2), privateKeyBuffer, {
		// Makes signatures compatible with libsecp256k1
		recovered: true,

		// Returned signature should be in DER format ( non compact )
		der: false,
	});

	const r = Buffer.from(signature.slice(0, 32));
	const s = Buffer.from(signature.slice(32, 64));
	const v = recoverId + 27;

	return {
		message: data,
		messageHash: hash,
		v: numberToHex(v),
		r: bytesToHex(r),
		s: bytesToHex(s),
		signature: `0x${Buffer.from(signature).toString('hex')}${v.toString(16)}`,
	};
};

/**
 * Signs an Ethereum transaction with a given private key.
 *
 * @param transaction - The transaction, must be a legacy, EIP2930 or EIP 1559 transaction type
 * @param privateKey -  The private key to import. This is 32 bytes of random data.
 * @returns A signTransactionResult object that contains message hash, r, s, v, transaction hash and raw transaction.
 *
 * This function is not stateful here. We need network access to get the account `nonce` and `chainId` to sign the transaction.
 * This function will rely on user to provide the full transaction to be signed. If you want to sign a partial transaction object
 * Use {@link Web3.eth.accounts.sign} instead.
 *
 * Signing a legacy transaction
 * ```ts
 * signTransaction({
 *	to: '0x118C2E5F57FD62C2B5b46a5ae9216F4FF4011a07',
 *	value: '0x186A0',
 *	gasLimit: '0x520812',
 *	gasPrice: '0x09184e72a000',
 *	data: '',
 *	chainId: 1,
 *	nonce: 0,
 * }, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318'))
 * }
 * > {
 * messageHash: '0x28b7b75f7ba48d588a902c1ff4d5d13cc0ca9ac0aaa39562368146923fb853bf',
 * v: '0x25',
 * r: '0x601b0017b0e20dd0eeda4b895fbc1a9e8968990953482214f880bae593e71b5',
 * s: '0x690d984493560552e3ebdcc19a65b9c301ea9ddc82d3ab8cfde60485fd5722ce',
 * rawTransaction: '0xf869808609184e72a0008352081294118c2e5f57fd62c2b5b46a5ae9216f4ff4011a07830186a08025a00601b0017b0e20dd0eeda4b895fbc1a9e8968990953482214f880bae593e71b5a0690d984493560552e3ebdcc19a65b9c301ea9ddc82d3ab8cfde60485fd5722ce',
 * transactionHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * ```
 * Signing an eip 1559 transaction
 * ```ts
 * signTransaction({
 *	to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
 *	maxPriorityFeePerGas: '0x3B9ACA00',
 *	maxFeePerGas: '0xB2D05E00',
 *	gasLimit: '0x6A4012',
 *	value: '0x186A0',
 *	data: '',
 *	chainId: 1,
 *	nonce: 0,
 * },"0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318")
 * > {
 *  messageHash: '0x5744f24d5f0aff6c70487c8e85adf07d8564e50b08558788f00479611d7bae5f',
 * v: '0x25',
 * r: '0x78a5a6b2876c3985f90f82073d18d57ac299b608cc76a4ba697b8bb085048347',
 * s: '0x9cfcb40cc7d505ed17ff2d3337b51b066648f10c6b7e746117de69b2eb6358d',
 * rawTransaction: '0xf8638080836a401294f0109fc8df283027b6285cc889f5aa624eac1f55830186a08025a078a5a6b2876c3985f90f82073d18d57ac299b608cc76a4ba697b8bb085048347a009cfcb40cc7d505ed17ff2d3337b51b066648f10c6b7e746117de69b2eb6358d',
 * transactionHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * }
 * ```
 * Signing an eip 2930 transaction
 * ```ts
 * signTransaction({
 *	chainId: 1,
 *	nonce: 0,
 *	gasPrice: '0x09184e72a000',
 *	gasLimit: '0x2710321',
 *	to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
 *	value: '0x186A0',
 *	data: '',
 *	accessList: [
 *		{
 *			address: '0x0000000000000000000000000000000000000101',
 *			storageKeys: [
 *				'0x0000000000000000000000000000000000000000000000000000000000000000',
 *				'0x00000000000000000000000000000000000000000000000000000000000060a7',
 *			],
 *		},
 *	],
 * },"0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318")
 * > {
 * messageHash: '0xc55ea24bdb4c379550a7c9a6818ac39ca33e75bc78ddb862bd82c31cc1c7a073',
 * v: '0x26',
 * r: '0x27344e77871c8b2068bc998bf28e0b5f9920867a69c455b2ed0c1c150fec098e',
 * s: '0x519f0130a1d662841d4a28082e9c9bb0a15e0e59bb46cfc39a52f0e285dec6b9',
 * rawTransaction: '0xf86a808609184e72a000840271032194f0109fc8df283027b6285cc889f5aa624eac1f55830186a08026a027344e77871c8b2068bc998bf28e0b5f9920867a69c455b2ed0c1c150fec098ea0519f0130a1d662841d4a28082e9c9bb0a15e0e59bb46cfc39a52f0e285dec6b9',
 * transactionHash: '0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470'
 * }
 * ```
 */
export const signTransaction = async (
	transaction: TypedTransaction,
	privateKey: HexString,
	// To make it compatible with rest of the API, have to keep it async
	// eslint-disable-next-line @typescript-eslint/require-await
): Promise<SignTransactionResult> => {
	const signedTx = transaction.sign(Buffer.from(privateKey.substring(2), 'hex'));
	if (isNullish(signedTx.v) || isNullish(signedTx.r) || isNullish(signedTx.s))
		throw new SignerError('Signer Error');

	const validationErrors = signedTx.validate(true);

	if (validationErrors.length > 0) {
		let errorString = 'Signer Error ';
		for (const validationError of validationErrors) {
			errorString += `${errorString} ${validationError}.`;
		}
		throw new SignerError(errorString);
	}

	const rawTx = bytesToHex(signedTx.serialize());
	const txHash = sha3Raw(rawTx); // using keccak in web3-utils.sha3Raw instead of SHA3 (NIST Standard) as both are different

	return {
		messageHash: bytesToHex(Buffer.from(signedTx.getMessageToSign(true))),
		v: `0x${signedTx.v.toString('hex')}`,
		r: `0x${signedTx.r.toString('hex')}`,
		s: `0x${signedTx.s.toString('hex')}`,
		rawTransaction: rawTx,
		transactionHash: bytesToHex(txHash),
	};
};

/**
 * Recovers the Ethereum address which was used to sign the given RLP encoded transaction.
 *
 * @param rawTransaction - The hex string having RLP encoded transaction
 * @returns The Ethereum address used to sign this transaction
 * ```ts
 * recoverTransaction('0xf869808504e3b29200831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a0c9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895a0727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68');
 * > "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"
 * ```
 */
export const recoverTransaction = (rawTransaction: HexString): Address => {
	if (isNullish(rawTransaction)) throw new UndefinedRawTransactionError();

	const tx = TransactionFactory.fromSerializedData(Buffer.from(rawTransaction.slice(2), 'hex'));

	return toChecksumAddress(tx.getSenderAddress().toString());
};

/**
 * Recovers the Ethereum address which was used to sign the given data
 *
 * @param data - Either a signed message, hash, or the {@link signatureObject}
 * @param signature - The raw RLP encoded signature
 * @param signatureOrV - signatureOrV
 * @param prefixedOrR - prefixedOrR
 * @param s - s
 * @param prefixed - (default: false) If the last parameter is true, the given message will NOT automatically be prefixed with "\\x19Ethereum Signed Message:\\n" + message.length + message, and assumed to be already prefixed.
 * @returns The Ethereum address used to sign this data
 * ```ts
 * sign('Some data', '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728');
 * > {
 * message: 'Some data',
 * messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
 * v: '0x1b',
 * r: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f9',
 * s: '0x53e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb150',
 * signature: '0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b'
 * }
 * recover('0xa8037a6116c176a25e6fc224947fde9e79a2deaa0dd8b67b366fbdfdbffc01f953e41351267b20d4a89ebfe9c8f03c04de9b345add4a52f15bd026b63c8fb1501b');
 * > '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0'
 * ```
 */
export const recover = (
	data: string | SignatureObject,
	signatureOrV?: string,
	prefixedOrR?: boolean | string,
	s?: string,
	prefixed?: boolean,
): Address => {
	if (typeof data === 'object') {
		const signatureStr = `${data.r}${data.s.slice(2)}${data.v.slice(2)}`;
		return recover(data.messageHash, signatureStr, prefixedOrR);
	}
	if (typeof signatureOrV === 'string' && typeof prefixedOrR === 'string' && !isNullish(s)) {
		const signatureStr = `${prefixedOrR}${s.slice(2)}${signatureOrV.slice(2)}`;
		return recover(data, signatureStr, prefixed);
	}

	if (isNullish(signatureOrV)) throw new InvalidSignatureError('signature string undefined');

	const V_INDEX = 130; // r = first 32 bytes, s = second 32 bytes, v = last byte of signature
	const hashedMessage = prefixedOrR ? data : hashMessage(data);

	const v = signatureOrV.substring(V_INDEX); // 0x + r + s + v

	const ecPublicKey = recoverPublicKey(
		Buffer.from(hashedMessage.substring(2), 'hex'),
		Buffer.from(signatureOrV.substring(2, V_INDEX), 'hex'),
		parseInt(v, 16) - 27,
		false,
	);

	const publicKey = `0x${Buffer.from(ecPublicKey).toString('hex').slice(2)}`;

	const publicHash = sha3Raw(publicKey);

	const address = toChecksumAddress(`0x${publicHash.slice(-40)}`);

	return address;
};

/**
 * Generate a version 4 (random) uuid
 * https://github.com/uuidjs/uuid/blob/main/src/v4.js#L5
 */

const uuidV4 = (): string => {
	const bytes = randomBytes(16);

	// https://github.com/ethers-io/ethers.js/blob/ce8f1e4015c0f27bf178238770b1325136e3351a/packages/json-wallets/src.ts/utils.ts#L54
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

/**
 * Get the ethereum Address from a private key
 *
 * @param privateKey - String or buffer of 32 bytes
 * @param ignoreLength - if true, will not error check length
 * @returns The Ethereum address
 * @example
 * ```ts
 * privateKeyToAddress("0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728")
 * > "0xEB014f8c8B418Db6b45774c326A0E64C78914dC0"
 * ```
 */
export const privateKeyToAddress = (privateKey: Bytes): string => {
	const privateKeyBuffer = parseAndValidatePrivateKey(privateKey);

	// Get public key from private key in compressed format
	const publicKey = getPublicKey(privateKeyBuffer);

	// Uncompressed ECDSA public key contains the prefix `0x04` which is not used in the Ethereum public key
	const publicKeyHash = sha3Raw(publicKey.slice(1));

	// The hash is returned as 256 bits (32 bytes) or 64 hex characters
	// To get the address, take the last 20 bytes of the public hash
	const address = publicKeyHash.slice(-40);

	return toChecksumAddress(`0x${address}`);
};

/**
 * encrypt a private key with a password, returns a V3 JSON Keystore
 *
 * Read more: https://github.com/ethereum/wiki/wiki/Web3-Secret-Storage-Definition
 *
 * @param privateKey - The private key to encrypt, 32 bytes.
 * @param password - The password used for encryption.
 * @param options - Options to configure to encrypt the keystore either scrypt or pbkdf2
 * @returns Returns a V3 JSON Keystore
 *
 *
 * Encrypt using scrypt options
 * ```ts
 * encrypt('0x67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
 * '123',
 * {
 *   n: 8192,
 *	 iv: Buffer.from('bfb43120ae00e9de110f8325143a2709', 'hex'),
 *	 salt: Buffer.from(
 *		'210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
 *		'hex',
 *	),
 * }).then(console.log)
 * > {
 * version: 3,
 * id: 'c0cb0a94-4702-4492-b6e6-eb2ac404344a',
 * address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
 * crypto: {
 *   ciphertext: 'cb3e13e3281ff3861a3f0257fad4c9a51b0eb046f9c7821825c46b210f040b8f',
 *   cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
 *   cipher: 'aes-128-ctr',
 *   kdf: 'scrypt',
 *   kdfparams: {
 *     n: 8192,
 *     r: 8,
 *     p: 1,
 *     dklen: 32,
 *     salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd'
 *   },
 *   mac: 'efbf6d3409f37c0084a79d5fdf9a6f5d97d11447517ef1ea8374f51e581b7efd'
 * }
 *}
 *```
 * Encrypting using pbkdf2 options
 * ```ts
 * encrypt('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
 *'123',
 *{
 *	iv: 'bfb43120ae00e9de110f8325143a2709',
 *	salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
 *	c: 262144,
 *	kdf: 'pbkdf2',
 *}).then(console.log)
 * >
 * {
 *   version: 3,
 *   id: '77381417-0973-4e4b-b590-8eb3ace0fe2d',
 *   address: 'b8ce9ab6943e0eced004cde8e3bbed6568b2fa01',
 *   crypto: {
 *     ciphertext: '76512156a34105fa6473ad040c666ae7b917d14c06543accc0d2dc28e6073b12',
 *     cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
 *     cipher: 'aes-128-ctr',
 *     kdf: 'pbkdf2',
 *     kdfparams: {
 *       dklen: 32,
 *       salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd',
 *       c: 262144,
 *       prf: 'hmac-sha256'
 *     },
 *   mac: '46eb4884e82dc43b5aa415faba53cc653b7038e9d61cc32fd643cf8c396189b7'
 *   }
 * }
 *```
 */
export const encrypt = async (
	privateKey: Bytes,
	password: string | Buffer,
	options?: CipherOptions,
): Promise<KeyStore> => {
	const privateKeyBuffer = parseAndValidatePrivateKey(privateKey);

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

	const cipher = await createCipheriv(
		privateKeyBuffer,
		Buffer.from(derivedKey.slice(0, 16)),
		initializationVector,
		'aes-128-ctr',
	);

	const ciphertext = bytesToHex(cipher).slice(2);

	const mac = sha3Raw(Buffer.from([...derivedKey.slice(16, 32), ...cipher])).replace('0x', '');

	return {
		version: 3,
		id: uuidV4(),
		address: privateKeyToAddress(privateKeyBuffer).toLowerCase().replace('0x', ''),
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
 * Get an Account object from the privateKey
 *
 * @param privateKey - String or buffer of 32 bytes
 * @param ignoreLength - if true, will not error check length
 * @returns A Web3Account object
 *
 * The `Web3Account.signTransaction` is not stateful here. We need network access to get the account `nonce` and `chainId` to sign the transaction.
 * Use {@link Web3.eth.accounts.signTransaction} instead.
 *
 * ```ts
 * privateKeyToAccount("0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709");
 * >    {
 * 			address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
 * 			privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
 * 			sign,
 * 			signTransaction,
 * 			encrypt,
 * 	}
 * ```
 */
export const privateKeyToAccount = (privateKey: Bytes, ignoreLength?: boolean): Web3Account => {
	const privateKeyBuffer = parseAndValidatePrivateKey(privateKey, ignoreLength);

	return {
		address: privateKeyToAddress(privateKeyBuffer),
		privateKey: bytesToHex(privateKeyBuffer),
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		signTransaction: (_tx: Record<string, unknown>) => {
			throw new SignerError('Do not have network access to sign the transaction');
		},
		sign: (data: Record<string, unknown> | string) =>
			sign(typeof data === 'string' ? data : JSON.stringify(data), privateKeyBuffer),
		encrypt: async (password: string, options?: Record<string, unknown>) => {
			const data = await encrypt(privateKeyBuffer, password, options);

			return JSON.stringify(data);
		},
	};
};

/**
 *
 * Generates and returns a Web3Account object that includes the private and public key
 * For creation of private key, it uses an audited package ethereum-cryptography/secp256k1
 * that is cryptographically secure random number with certain characteristics.
 * Read more: https://www.npmjs.com/package/ethereum-cryptography#secp256k1-curve
 *
 * @returns A Web3Account object
 * ```ts
 * web3.eth.accounts.create();
 * {
 * address: '0xbD504f977021b5E5DdccD8741A368b147B3B38bB',
 * privateKey: '0x964ced1c69ad27a311c432fdc0d8211e987595f7eb34ab405a5f16bdc9563ec5',
 * signTransaction: [Function: signTransaction],
 * sign: [Function: sign],
 * encrypt: [AsyncFunction: encrypt]
 * }
 * ```
 */
export const create = (): Web3Account => {
	const privateKey = utils.randomPrivateKey();

	return privateKeyToAccount(`0x${Buffer.from(privateKey).toString('hex')}`);
};

/**
 * Decrypts a v3 keystore JSON, and creates the account.
 *
 * @param keystore - the encrypted Keystore object or string to decrypt
 * @param password - The password that was used for encryption
 * @param nonStrict - if true and given a json string, the keystore will be parsed as lowercase.
 * @returns Returns the decrypted Web3Account object
 * Decrypting scrypt
 *
 * ```ts
 * decrypt({
 *   version: 3,
 *   id: 'c0cb0a94-4702-4492-b6e6-eb2ac404344a',
 *   address: 'cda9a91875fc35c8ac1320e098e584495d66e47c',
 *   crypto: {
 *   ciphertext: 'cb3e13e3281ff3861a3f0257fad4c9a51b0eb046f9c7821825c46b210f040b8f',
 *      cipherparams: { iv: 'bfb43120ae00e9de110f8325143a2709' },
 *      cipher: 'aes-128-ctr',
 *      kdf: 'scrypt',
 *      kdfparams: {
 *        n: 8192,
 *        r: 8,
 *        p: 1,
 *        dklen: 32,
 *        salt: '210d0ec956787d865358ac45716e6dd42e68d48e346d795746509523aeb477dd'
 *      },
 *      mac: 'efbf6d3409f37c0084a79d5fdf9a6f5d97d11447517ef1ea8374f51e581b7efd'
 *    }
 *   }, '123').then(console.log)
 * > {
 * address: '0xcdA9A91875fc35c8Ac1320E098e584495d66e47c',
 * privateKey: '67f476289210e3bef3c1c75e4de993ff0a00663df00def84e73aa7411eac18a6',
 * signTransaction: [Function: signTransaction],
 * sign: [Function: sign],
 * encrypt: [AsyncFunction: encrypt]
 * }
 * ```
 */
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
