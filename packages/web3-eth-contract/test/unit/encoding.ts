/* eslint-disable jest/expect-expect */

import { decodeEventABI } from '../../src/encoding';
import { decodeEventABIData } from '../fixtures/encoding';
import { AbiEventFragment } from 'web3-eth-abi';
import { LogsInput } from 'web3-common';

describe('encoding decoding functions', () => {

	beforeAll(() => {
	});

	describe('decode', () => {
		describe('decodeEventABI', () => {
			it.each(decodeEventABIData)(
				'returnType: %s mockRpcResponse: %s output: %s',
				(event: AbiEventFragment & {signature: string}, inputs: LogsInput, output) => {
					expect(decodeEventABI(event,inputs)).toBe(output);

				},
			);
		});
    })
});