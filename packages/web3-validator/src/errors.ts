import { Web3ValidationErrorObject } from './types';

const errorFormatter = (error: Web3ValidationErrorObject): string => {
	if (error.message && error.instancePath && error.params && error.params.value != null) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		return `value "${(error.params as { value: unknown }).value}" at "${error.instancePath}" ${
			error.message
		}`;
	}

	if (error.message && error.instancePath) {
		return `value at "${error.instancePath}" ${error.message}`;
	}

	if (error.instancePath) {
		return `value at "${error.instancePath}" caused unspecified error`;
	}

	if (error.message) {
		return error.message;
	}

	return 'unspecified error';
};

export class Web3ValidatorError extends Error {
	public readonly name: string;
	public readonly errors: Web3ValidationErrorObject[];

	public constructor(errors: Web3ValidationErrorObject[]) {
		super();
		this.name = this.constructor.name;
		this.errors = errors;

		this.message = `Web3 validator found ${
			this.errors.length
		} error[s]:\n${this._compileErrors().join('\n')}`;

		Error.captureStackTrace(this, Web3ValidatorError);
	}

	public toJSON() {
		return { name: this.name, message: this.message };
	}

	private _compileErrors(): string[] {
		const errorMsgs = this.errors.map(errorFormatter);
		return errorMsgs;
	}
}
