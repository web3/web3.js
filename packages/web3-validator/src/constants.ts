export const VALID_ETH_BASE_TYPES = [
	'bool',
	'int',
	'uint',
	'bytes',
	'string',
	'address',
	'tuple',
] as const;

export enum BlockTags {
	EARLIEST = 'earliest',
	LATEST = 'latest',
	PENDING = 'pending',
}
