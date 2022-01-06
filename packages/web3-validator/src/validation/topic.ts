import { isBloom, isInBloom } from './bloom';

/**
 * Checks if its a valid topic
 */
export const isTopic = (topic: string): boolean => {
	if (typeof topic !== 'string') {
		return false;
	}

	if (!/^(0x)?[0-9a-f]{64}$/i.test(topic)) {
		return false;
	}

	if (/^(0x)?[0-9a-f]{64}$/.test(topic) || /^(0x)?[0-9A-F]{64}$/.test(topic)) {
		return true;
	}

	return false;
};

/**
 * Returns true if the topic is part of the given bloom.
 * note: false positives are possible.
 */
export const isTopicInBloom = (bloom: string, topic: string): boolean => {
	if (!isBloom(bloom)) {
		return false;
	}

	if (!isTopic(topic)) {
		return false;
	}

	return isInBloom(bloom, topic);
};
