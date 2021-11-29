import { utils, getPublicKey } from 'ethereum-cryptography/secp256k1';
// Will be added later
const encrypt = (): boolean => true;

// Will be added later
const sign = (): boolean => true;

// Will be added later
const signTransaction = (): boolean => true;

/**
 * Get address from private key
 */
export const fromPrivate = (privateKey: string | Uint8Array): string => {
	const stringPrivateKey =
		typeof privateKey === 'object' ? Buffer.from(privateKey).toString('hex') : privateKey;
	const updatedKey = stringPrivateKey.startsWith('0x')
		? stringPrivateKey.slice(2)
		: stringPrivateKey;

	// 64 hex characters + hex-prefix
	if (updatedKey.length !== 64) {
		throw new Error('Private key must be 32 bytes long');
	}
	const address = getPublicKey(updatedKey);
	return `0x${address}`;
};

/**
 * Returns a random hex string by the given bytes size
 */
export const create = (): {
	address: string;
	privateKey: string;
	signTransaction: Function; // From 1.x, removing this would be a breaking change
	sign: Function;
	encrypt: Function;
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
