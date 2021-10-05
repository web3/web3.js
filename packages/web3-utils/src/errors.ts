export const errorMessage = (value: unknown, error: string) =>
	`Invalid value given "${String(value)}". Error: ${error}.`;

export const errorNegativeIntegers = (data: unknown) =>
	errorMessage(data, 'contains negative values');
export const errorHigherValueIntegers = (data: unknown) =>
	errorMessage(data, 'contains numbers greater than 255');
export const errorInvalidIntegersValues = (data: unknown) =>
	errorMessage(data, 'contains invalid integer values');
export const errorInvalidInteger = (data: unknown) => errorMessage(data, 'not a valid integer');
export const errorInvalidNumber = (data: unknown) => errorMessage(data, 'not a valid number');
export const errorInvalidString = (data: unknown) => errorMessage(data, 'not a valid string');
export const errorInvalidHexString = (data: unknown) => errorMessage(data, 'not valid hex string');
export const errorInvalidBytesData = (data: unknown) =>
	errorMessage(data, 'can not parse as byte data');
export const errorInvalidUnit = (data: unknown) => errorMessage(data, 'invalid unit');
export const errorInvalidAddress = (data: unknown) =>
	errorMessage(data, 'invalid ethereum address');
export const errorCannotParseHex = (data: unknown) =>
	errorMessage(data, 'can not be converted to hex');
export const errorInvalidDenominator = (data: unknown) =>
	errorMessage(data, 'denominator must be number power of 10');
