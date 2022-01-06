import { ShortValidationSchema } from '../types';
import { AbiParameter } from '../private_types';

export const isAbiParameterSchema = (
	schema: string | ShortValidationSchema | AbiParameter,
): schema is AbiParameter => typeof schema === 'object' && 'type' in schema && 'name' in schema;
