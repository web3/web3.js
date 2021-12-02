import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
import { toChecksumAddress, bytesToHex, sha3Raw, HexString } from 'web3-utils';
import { InvalidPrivateKeyError, PrivateKeyLengthError } from './errors';

// Will be added later
// Will be added later
export const sign = (): boolean => true;

// Will be added later
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
	if (!privateKey) {
		throw new InvalidPrivateKeyError(privateKey);
	}

	const stringPrivateKey =
		typeof privateKey === 'object' ? Buffer.from(privateKey).toString('hex') : privateKey;

	const updatedKey = stringPrivateKey.startsWith('0x')
		? stringPrivateKey.slice(2)
		: stringPrivateKey;

	// Must be 64 hex characters
	if (updatedKey.length !== 64) {
		throw new PrivateKeyLengthError(updatedKey);
	}

	const publicKey = getPublicKey(updatedKey);

	const publicKeyString = `0x${publicKey.slice(2)}`;
	const publicHash = sha3Raw(publicKeyString);
	const publicHashHex = bytesToHex(publicHash);
	const address = toChecksumAddress(publicHashHex.slice(-40));
	return { address, privateKey: stringPrivateKey, signTransaction, sign, encrypt };
};


export const encrypt = (privateKey: string): boolean => {
	const account = 
	return true
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
