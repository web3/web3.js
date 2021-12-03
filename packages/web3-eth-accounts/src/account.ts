import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
import {
	toChecksumAddress,
	bytesToHex,
	sha3Raw,
	HexString,
	isBuffer,
	isValidString,
} from 'web3-utils';
import { InvalidPrivateKeyError, PrivateKeyLengthError } from 'web3-common';

// TODO Will be added later
export const encrypt = (): boolean => true;

// TODO Will be added later
export const sign = (): boolean => true;

// TODO Will be added later
export const signTransaction = (): boolean => true;

/**
 * Get account from private key
 */
export const privateKeyToAccount = (
	privateKey: string | Buffer,
): {
	address: string;
	privateKey: string;
	signTransaction: () => boolean; // From 1.x
	sign: () => boolean;
	encrypt: () => boolean;
} => {
	if (!(isValidString(privateKey) || isBuffer(privateKey))) {
		throw new InvalidPrivateKeyError(privateKey);
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
		throw new PrivateKeyLengthError(stringPrivateKeyNoPrefix);
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
	signTransaction: () => boolean; // From 1.x
	sign: () => boolean;
	encrypt: () => boolean;
} => {
	const privateKey = utils.randomPrivateKey();
	const address = getPublicKey(privateKey);
	return {
		privateKey: `0x${Buffer.from(privateKey).toString('hex')}`,
		address: `0x${Buffer.from(address).toString('hex')}`,
		signTransaction,
		sign,
		encrypt,
	};
};
