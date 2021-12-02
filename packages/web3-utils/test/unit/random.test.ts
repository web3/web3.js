import { isHexStrict } from '../../src/validation';
import { randomHex } from '../../src/random';
import { randomHexData } from '../fixtures/random';

describe('random library tests', () => {
	describe('randomHex', () => {
		describe('valid cases', () => {
			it.each(randomHexData)('%s', input => {
				const hexResult = randomHex(input);
				expect(isHexStrict(hexResult)).toBe(true);
				expect(hexResult.length === input * 2 + 2).toBe(true); // bytes + 2 because of hex prefix '0x'
			});
		});
	});
});
