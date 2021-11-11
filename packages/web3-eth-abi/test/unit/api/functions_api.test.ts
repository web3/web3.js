import { encodeFunctionSignature } from '../../../src/api/functions_api';

describe('functions_api', () => {
	describe('encodeFunctionSignature', () => {
		it.each([
			['myMethod(uint256,string)', '0x24ee0097'],
			[
				{
					name: 'myMethod',
					type: 'function' as const,
					inputs: [
						{
							type: 'uint256',
							name: 'myNumber',
						},
						{
							type: 'string',
							name: 'myString',
						},
					],
				},
				'0x24ee0097',
			],
		])('should pass for valid values: %s', (input, output) => {
			expect(encodeFunctionSignature(input)).toEqual(output);
		});
	});
});
