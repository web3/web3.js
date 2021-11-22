import { randomBytes } from 'crypto';
/**
 * Returns a random hex string by the given bytes size
 *
 * @param {Number} size
 * @returns {string}
 */
export const randomHex = (byteSize: number): string => {
	const randomValues =
		typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues
			? window.crypto.getRandomValues(new Uint8Array(byteSize))
			: randomBytes(byteSize);
	return `0x${randomValues.toString('hex')}`;
};
