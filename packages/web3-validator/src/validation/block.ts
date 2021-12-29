import { BlockTags } from '../types';
import { isHexStrict } from './string';

export const isBlockNumber = (value: string): boolean =>
	isHexStrict(value) && !value.startsWith('-');

/**
 * Returns true if the given blockNumber is 'latest', 'pending', or 'earliest.
 */
export const isBlockTag = (value: string) =>
	BlockTags.LATEST === value || BlockTags.PENDING === value || BlockTags.EARLIEST === value;

/**
 * Returns true if given value is valid hex string and not negative, or is a valid BlockTag
 */
export const isBlockNumberOrTag = (value: string) =>
	(isHexStrict(value) && !value.startsWith('-')) || isBlockTag(value);
