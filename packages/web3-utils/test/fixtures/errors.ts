export const ConvertValueToString: [unknown, string][] = [
	[BigInt(9007199254740991), '9007199254740991'],
	['Invalid data', 'Invalid data'],
	['0x0', '0x0'],
	[0, '0'],
	[{ title: 'testObj', id: 1 }, '{"title":"testObj","id":1}'],
];
