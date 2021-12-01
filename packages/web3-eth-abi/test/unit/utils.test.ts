import { jsonInterfaceMethodToString } from '../../src/utils';
import { jsonInterfaceInvalidData, jsonInterfaceValidData } from '../fixtures/data';

describe('utils', () => {
	describe('jsonInterfaceMethodToString', () => {
		describe('valid cases', () => {
			it.each(jsonInterfaceValidData)('%s', (input, output) => {
				expect(jsonInterfaceMethodToString(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			// TODO: To be done after `sha3` is implemented
			it.todo('should throw error for invalid cases');
		});
	});
	describe('jsonInterface', () => {
		describe('valid cases', () => {
			it.each(jsonInterfaceValidData)('%s', (input, output) => {
				expect(jsonInterfaceMethodToString(input)).toEqual(output);
			});
		});
		describe('invalid cases', () => {
			it.each(jsonInterfaceInvalidData)('%s', (input, output) => {
				expect(() => jsonInterfaceMethodToString(input)).toThrow(output);
			});
		});
	});
});
