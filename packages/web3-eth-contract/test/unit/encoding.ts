import { AbiEventFragment } from 'web3-eth-abi';
import { LogsInput } from 'web3-common';
import { decodeEventABI } from '../../src/encoding';
import { decodeEventABIData } from '../fixtures/encoding';

describe('encoding decoding functions', () => {
	describe('decode', () => {
		describe('decodeEventABI', () => {
			it.each(decodeEventABIData)(
				'%s',
				(event: AbiEventFragment & { signature: string }, inputs: LogsInput, output) => {
					expect(decodeEventABI(event, inputs)).toBe(output);
				},
			);
		});
	});
});
