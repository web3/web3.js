/* eslint-disable max-classes-per-file */

import {
	InvalidValueError,
	ERR_INVALID_STRING,
	ERR_INVALID_UNIT,
	ERR_INVALID_TYPE_ABI,
	ERR_INVALID_HEX,
	ERR_INVALID_NIBBLE_WIDTH,
	ERR_INVALID_TYPE,
	ERR_INVALID_BOOLEAN,
	ERR_INVALID_UNSIGNED_INTEGER,
	ERR_INVALID_SIZE,
	ERR_INVALID_LARGE_VALUE,
	ERR_INVALID_BLOCK,
} from 'web3-common';

export class InvalidStringError extends InvalidValueError {
	public code = ERR_INVALID_STRING;

	public constructor(value: unknown) {
		super(value, 'not a valid string');
	}
}

export class InvalidUnitError extends InvalidValueError {
	public code = ERR_INVALID_UNIT;

	public constructor(value: unknown) {
		super(value, 'invalid unit');
	}
}

export class HexProcessingError extends InvalidValueError {
	public code = ERR_INVALID_HEX;

	public constructor(value: unknown) {
		super(value, 'can not be converted to hex');
	}
}

export class NibbleWidthError extends InvalidValueError {
	public code = ERR_INVALID_NIBBLE_WIDTH;

	public constructor(value: string) {
		super(value, 'value greater than the nibble width');
	}
}

export class InvalidTypeError extends InvalidValueError {
	public code = ERR_INVALID_TYPE;

	public constructor(value: unknown) {
		super(value, 'invalid type, type not supported');
	}
}

export class InvalidBooleanError extends InvalidValueError {
	public code = ERR_INVALID_BOOLEAN;

	public constructor(value: unknown) {
		super(value, 'not a valid boolean.');
	}
}

export class InvalidUnsignedIntegerError extends InvalidValueError {
	public code = ERR_INVALID_UNSIGNED_INTEGER;

	public constructor(value: unknown) {
		super(value, 'not a valid unsigned integer.');
	}
}

export class InvalidSizeError extends InvalidValueError {
	public code = ERR_INVALID_SIZE;

	public constructor(value: unknown) {
		super(value, 'invalid size given.');
		this.code = ERR_INVALID_SIZE;
	}
}

export class InvalidLargeValueError extends InvalidValueError {
	public code = ERR_INVALID_LARGE_VALUE;

	public constructor(value: unknown) {
		super(value, 'value is larger than size.');
		this.code = ERR_INVALID_LARGE_VALUE;
	}
}

export class InvalidBlockError extends InvalidValueError {
	public code = ERR_INVALID_BLOCK;

	public constructor(value: string) {
		super(value, 'invalid string given');
	}
}

export class InvalidTypeAbiInputError extends InvalidValueError {
	public code = ERR_INVALID_TYPE_ABI;

	public constructor(value: string) {
		super(value, 'components found but type is not tuple');
	}
}
