export const InvalidTransactionWithSenderData: [unknown, string][] = [
	[
		BigInt(9007199254740991),
		'Invalid value given "9007199254740991". Error: invalid transaction with sender.',
	],
	['Invalid data', 'Invalid value given "Invalid data". Error: invalid transaction with sender.'],
	['0x0', 'Invalid value given "0x0". Error: invalid transaction with sender.'],
	[0, 'Invalid value given "0". Error: invalid transaction with sender.'],
];

export const InvalidTransactionCallData: [unknown, string][] = [
	[
		BigInt(9007199254740991),
		'Invalid value given "9007199254740991". Error: invalid transaction call',
	],
	['Invalid data', 'Invalid value given "Invalid data". Error: invalid transaction call'],
	['0x0', 'Invalid value given "0x0". Error: invalid transaction call'],
	[0, 'Invalid value given "0". Error: invalid transaction call'],
];
