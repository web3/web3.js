import { encodeFunctionCall, encodeFunctionSignature } from '../../../src/api/functions_api';
import {
	inValidFunctionsSignatures,
	validFunctionsSignatures,
	validFunctionsCall,
	inValidFunctionsCalls,
} from '../../fixtures/data';

describe('functions_api', () => {
	describe('encodeFunctionSignature', () => {
		describe('valid data', () => {
			it.each(validFunctionsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(encodeFunctionSignature(input)).toEqual(output);
				},
			);
		});

		describe('invalid data', () => {
			it.each(inValidFunctionsSignatures)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(() => encodeFunctionSignature(input)).toThrow(output);
				},
			);
		});
	});

	describe('encodeFunctionCall', () => {
		describe('valid data', () => {
			it.each(validFunctionsCall)(
				'should pass for valid values: %s',
				({ input: { abi, params }, output }) => {
					expect(encodeFunctionCall(abi, params)).toEqual(output);
				},
			);
		});

		describe('invalid data', () => {
			it.each(inValidFunctionsCalls)(
				'should pass for valid values: %s',
				({ input, output }) => {
					expect(() => encodeFunctionCall(input, [])).toThrow(output);
				},
			);
		});
	});
});
