/* eslint-disable max-classes-per-file */

export abstract class Web3Error extends Error {
	public readonly name: string;

	public constructor(value: unknown, msg: string) {
		super(`Invalid value given "${String(value)}". Error: ${msg}.`);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, Web3Error);
	}

	public toJSON() {
		return { name: this.name, message: this.message };
	}
}

export class NegativeIntegersInByteArrayError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'contains negative values');
	}
}
export class HighValueIntegerInByteArrayError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'contains numbers greater than 255');
	}
}
export class InvalidIntegerInByteArrayError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'contains invalid integer values');
	}
}

export class InvalidIntegerError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid integer');
	}
}

export class InvalidNumberError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid number');
	}
}

export class InvalidStringError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid string');
	}
}

export class InvalidHexStringError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid hex string');
	}
}

export class InvalidBytesError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'can not parse as byte data');
	}
}

export class InvalidUnitError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'invalid unit');
	}
}

export class InvalidAddressError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'invalid ethereum address');
	}
}

export class HexProcessingError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'can not be converted to hex');
	}
}

export class InvalidDenominatorError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'denominator must be number power of 10');
	}
}

export class NibbleWidthError extends Web3Error {
	public constructor(value: string) {
		super(value, 'value greater than the nibble width');
	}
}

export class InvalidType extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'invalid type, type not supported');
	}
}

export class InvalidArrayError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'array types is not supported.');
	}
}

export class InvalidBooleanError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid boolean.');
	}
}

export class InvalidUnsignedIntegerError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid unsigned integer.');
	}
}

export class InvalidSizeError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'invalid size given.');
	}
}

export class InvalidLargeValueError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'value is larger than size.');
	}
}

export class InvalidBlockError extends Web3Error {
	public constructor(value: string) {
		super(value, 'invalid string given');
	}
}

export class InvalidBloomError extends Web3Error {
	public constructor(value: string) {
		super(value, 'invalid bloom given');
	}
}

export class InvalidTopicError extends Web3Error {
	public constructor(value: string) {
		super(value, 'invalid topic given');
	}
}

export class InvalidCharCodeError extends Web3Error {
	public constructor(value: number) {
		super(value, 'invalid char code given');
	}
}

export class InvalidTypeAbiInput extends Web3Error {
	public constructor(value: string) {
		super(value, 'components found but type is not tuple');
	}
}
