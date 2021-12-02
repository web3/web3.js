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

export class PrivateKeyLengthError extends Web3Error {
	public constructor(value: string) {
		super(value, 'Private key must be 32 bytes long');
	}
}

export class InvalidPrivateKeyError extends Web3Error {
	public constructor(value: string) {
		super(value, 'not a valid string or buffer');
	}
}
