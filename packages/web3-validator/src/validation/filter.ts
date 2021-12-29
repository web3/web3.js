import { Filter } from '../types';
import { isAddress } from './address';
import { isBlockNumberOrTag } from './block';
import { isTopic } from './topic';

/**
 * First we check if all properties in the provided value are expected,
 * then because all Filter properties are optional, we check if the expected properties
 * are defined. If defined and they're not the expected type, we immediately return false,
 * otherwise we return true after all checks pass.
 */
export const isFilterObject = (value: Filter) => {
	const expectedFilterProperties: (keyof Filter)[] = [
		'fromBlock',
		'toBlock',
		'address',
		'topics',
	];
	if (value === null || typeof value !== 'object') return false;

	if (
		!Object.keys(value).every(property =>
			expectedFilterProperties.includes(property as keyof Filter),
		)
	)
		return false;

	if (
		(value.fromBlock !== undefined && !isBlockNumberOrTag(value.fromBlock)) ||
		(value.toBlock !== undefined && !isBlockNumberOrTag(value.toBlock))
	)
		return false;

	if (value.address !== undefined) {
		if (Array.isArray(value.address)) {
			if (!value.address.every(address => isAddress(address))) return false;
		} else if (!isAddress(value.address)) return false;
	}

	if (value.topics !== undefined) {
		if (
			!value.topics.every(topic => {
				if (topic === null) return true;

				if (Array.isArray(topic)) {
					return topic.every(nestedTopic => isTopic(nestedTopic));
				}

				if (isTopic(topic)) return true;

				return false;
			})
		)
			return false;
	}

	return true;
};
