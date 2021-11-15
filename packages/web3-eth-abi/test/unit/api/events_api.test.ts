import { encodeEventSignature } from '../../../src/api/events_api';
import { inValidEventsSignatures, validEventsSignatures } from '../../fixtures/data';

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
			it.each(inValidEventsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(() => encodeEventSignature(input)).toThrow(output);
				},
			);
		});
	});
});
