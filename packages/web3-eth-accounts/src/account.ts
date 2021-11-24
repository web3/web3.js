/* eslint-disable */
const keythereum = require('keythereum');

// Will be added later
const encrypt = () => {};

// Will be added later
const sign = () => {};

// Will be added later
const signTransaction = () => {};

/**
 * Get address from private key
 */
export const fromPrivate = (privateKey: string, ignoreLength: boolean): string => {
	const updatedKey = !privateKey.startsWith('0x') ? `0x${privateKey}` : privateKey;

	// 64 hex characters + hex-prefix
	if (!ignoreLength && updatedKey.length !== 66) {
		throw new Error('Private key must be 32 bytes long');
	}

	return keythereum.privateKeyToAddress(Buffer.from(updatedKey));
};

/**
 * Returns a random hex string by the given bytes size
 */
export const create = (): {
	address: string;
	privateKey: string;
	signTransaction: Function;
	sign: Function;
	encrypt: Function;
} => {
	const newKey = keythereum.create();
	const privateKey = newKey.privateKey;
	const address = keythereum.privateKeyToAddress(privateKey);
	return { privateKey: privateKey.toString('hex'), address, signTransaction, sign, encrypt };
};
