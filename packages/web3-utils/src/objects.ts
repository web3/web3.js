const isIterable = (item: unknown): item is Record<string, unknown> =>
	typeof item === 'object' && item !== null && !Array.isArray(item) && !Buffer.isBuffer(item);

// The following code is a derivative work of the code from the "LiskHQ/lisk-sdk" project,
// which is licensed under Apache version 2.
export const mergeDeep = (
	destination: Record<string, unknown>,
	...sources: Record<string, unknown>[]
): Record<string, unknown> => {
	const result = destination; // clone deep here
	if (!isIterable(result)) {
		return result;
	}
	for (const src of sources) {
		// eslint-disable-next-line no-restricted-syntax
		for (const key in src) {
			if (isIterable(src[key])) {
				if (!result[key]) {
					result[key] = {};
				}
				mergeDeep(
					result[key] as Record<string, unknown>,
					src[key] as Record<string, unknown>,
				);
			} else if (src[key] !== undefined && src[key] !== null) {
				result[key] = src[key];
			}
		}
	}
	return result;
};
