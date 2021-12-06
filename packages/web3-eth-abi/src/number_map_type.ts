// TODO: Convert it to static file
type _SolidityIndexRange = 1 | 2 | 3 | 4 | 5;

export type ConvertToNumber<
	T extends string,
	Range extends number = _SolidityIndexRange,
> = Range extends unknown ? (`${Range}` extends T ? Range : never) : never;
