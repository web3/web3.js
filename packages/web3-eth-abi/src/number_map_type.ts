type _SolidityIndexRange =
	| 1
	| 2
	| 3
	| 4
	| 5
	| 6
	| 7
	| 8
	| 9
	| 10
	| 11
	| 12
	| 13
	| 14
	| 15
	| 16
	| 17
	| 18
	| 19
	| 20
	| 21
	| 22
	| 25
	| 26
	| 27
	| 28
	| 29
	| 30;

export type ConvertToNumber<
	T extends string,
	Range extends number = _SolidityIndexRange,
> = Range extends unknown ? (`${Range}` extends T ? Range : never) : never;
