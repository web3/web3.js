import { ethers } from 'ethers';
import { sha3 } from '../../src/hash';
import { sha3InvalidData, sha3ValidData, sha3EthersValidData } from '../fixtures/hash';

describe('hash', () => {
	describe('sha3', () => {
		describe('valid cases', () => {
			it.each(sha3ValidData)('%s', (input, output) => {
				expect(sha3(input)).toEqual(output);
			});
		});

		describe('invalid cases', () => {
			it.each(sha3InvalidData)('%s', (input, output) => {
				expect(() => sha3(input)).toThrow(output);
			});
		});

		describe('ethers cases', () => {
			it.each(sha3EthersValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(sha3(input)).toEqual(ethers.utils.keccak256(output));
			});
		});
	});
});
