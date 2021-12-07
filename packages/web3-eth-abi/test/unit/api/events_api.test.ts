import { encodeEventSignature } from '../../../src/api/events_api';
import { invalidEventsSignatures, validEventsSignatures } from '../../fixtures/data';

describe('events_api', () => {
	describe('encodeEventSignature', () => {
		describe('valid data', () => {
			it.each(validEventsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(encodeEventSignature(input)).toEqual(output);
				},
			);
		});
		describe('invalid data', () => {
			it.each(invalidEventsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(() => encodeEventSignature(input)).toThrow(output);
				},
			);
		});
	});
});
