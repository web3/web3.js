import { ethers } from 'ethers';
import { sha3, sha3Raw } from '../../src/hash';
import {
	sha3InvalidData,
	sha3ValidData,
	sha3EthersValidData,
	sha3RawEthersValidData,
} from '../fixtures/hash';

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

		describe('comparing with ether cases', () => {
			it.each(sha3EthersValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(sha3(input)).toEqual(ethers.utils.keccak256(output));
			});
		});
	});

	describe('sha3Raw', () => {
		describe('comparing with ether cases', () => {
			it.each(sha3RawEthersValidData)('%s', (input, output) => {
				// eslint-disable-next-line @typescript-eslint/no-magic-numbers
				expect(sha3Raw(input)).toEqual(ethers.utils.keccak256(output));
			});
		});
		describe('invalid cases', () => {
			it.each(sha3InvalidData)('%s', (input, output) => {
				expect(() => sha3Raw(input)).toThrow(output);
			});
		});
	});
});
