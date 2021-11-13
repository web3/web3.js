import { Block } from 'web3-common';

export const convertibleBlockProperties: (keyof Block)[] = [
	'difficulty',
	'number',
	'gasLimit',
	'gasUsed',
	'timestamp',
	'nonce',
	'totalDifficulty',
	'baseFeePerGas',
	'size',
];
