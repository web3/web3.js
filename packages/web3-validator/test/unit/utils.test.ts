import { ethAbiToJsonSchema } from '../../src/utils';
import { abiToJsonSchemaCases } from '../fixtures/abi_to_json_schema';

describe('ethAbiToJsonSchema', () => {
	describe('full schema', () => {
		it.each(abiToJsonSchemaCases)('$title', ({ input, output }) => {
			expect(ethAbiToJsonSchema(input.full)).toEqual(output);
		});
	});

	describe('short schema', () => {
		it.each(abiToJsonSchemaCases)('$title', ({ input, output }) => {
			expect(ethAbiToJsonSchema(input.short)).toEqual(output);
		});
	});
});
