import { randomHex, toChecksumAddress } from 'web3-utils';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { getPublicKey } from 'ethereum-cryptography/secp256k1';

/**
 * Get address from private key
 */
export const fromPrivate = (privateKey: string) => {
	const buffer = Buffer.from(privateKey.slice(2), 'hex');
	const publicKey = getPublicKey(buffer);
	const publicHash = keccak256(Buffer.from(publicKey)).toString();
	const address = '0x'.concat(publicHash.slice(-40));
	const checkSumAddress = toChecksumAddress(address);
	return {
		address: checkSumAddress,
		privateKey,
	};
};

/**
 * Returns a random hex string by the given bytes size
 */
export const create = (entropy?: number): { address: string; privateKey: string } => {
	const innerHex = keccak256(Buffer.from(randomHex(32).concat(entropy ?? randomHex(32))));
	const middleHex = keccak256(Buffer.from(randomHex(32).concat(innerHex, randomHex(32))));
	const outerHex = keccak256(Buffer.from(middleHex));
	return fromPrivate(outerHex.toString());
};
