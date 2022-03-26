/* eslint-disable max-classes-per-file */
export abstract class Web3Error extends Error {
	public readonly name: string;

	public constructor(value: unknown, msg: string) {
		super(`Invalid value given "${Web3Error.convertToString(value, true)}". Error: ${msg}.`);
		this.name = this.constructor.name;
		Error.captureStackTrace(this, Web3Error);
	}

	public toJSON() {
		return { name: this.name, message: this.message };
	}

	public static convertToString(value: unknown, unquotValue = false) {
		if (value === undefined) return 'undefined';

		const result = JSON.stringify(
			value,
			(_, v) => (typeof v === 'bigint' ? v.toString() : v) as unknown,
		);

		return unquotValue && ['bigint', 'string'].includes(typeof value)
			? result.replace(/['\\"]+/g, '')
			: result;
	}
}

export class InvalidStringError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'not a valid string');
	}
}

export class InvalidBytesError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'can not parse as byte data');
	}
}

export class InvalidNumberError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'can not parse as number data');
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

export class NibbleWidthError extends Web3Error {
	public constructor(value: string) {
		super(value, 'value greater than the nibble width');
	}
}

export class InvalidTypeError extends Web3Error {
	public constructor(value: unknown) {
		super(value, 'invalid type, type not supported');
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

export class InvalidTypeAbiInputError extends Web3Error {
	public constructor(value: string) {
		super(value, 'components found but type is not tuple');
	}
}
