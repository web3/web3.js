import { randomBytes as cryptoRandomBytes } from 'crypto';

/**
 * Returns a random byte array by the given bytes size
 *
 * @param {Number} size
 * @returns {Buffer}
 */
 export const randomBytes = (byteSize: number): Buffer => {
	const randomValues =
		typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues
			? window.crypto.getRandomValues(new Uint8Array(byteSize))
			: cryptoRandomBytes(byteSize);
	return Buffer.from(randomValues);
};


/**
 * Returns a random hex string by the given bytes size
 *
 * @param {Number} size
 * @returns {string}
 */
export const randomHex = (byteSize: number): string => `0x${randomBytes(byteSize).toString('hex')}`;


