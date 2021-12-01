import { decodeLog } from '../../../src/api/logs_api';
import { validDecodeLogsData } from '../../fixtures/data';

describe('logs_api', () => {
	describe('decodeLog', () => {
		describe('valid data', () => {
			it.each(validDecodeLogsData)(
				'should pass for valid values: %s',
				({ input: { abi, data, topics }, output }) => {
					expect(decodeLog(abi, data, topics)).toEqual(output);
				},
			);
		});
	});
});
