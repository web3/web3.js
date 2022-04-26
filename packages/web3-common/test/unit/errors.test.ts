/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

import * as errors from '../../src/errors';

describe('errors', () => {
	it('should have unique codes for each error', () => {
		const errorCodes: number[] = [];

		for (const ErrorClass of Object.values(errors)) {
			// To disable error for the abstract class

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			const err = new ErrorClass({} as never);
			errorCodes.push(err.code);
		}

		expect(errorCodes.filter((x, y) => errorCodes.indexOf(x) === y)).toHaveLength(
			errorCodes.length,
		);
	});

	describe('InvalidNumberOfParamsError', () => {
		it('should have valid json structure', () => {
			const got = 10;
			const expected = 20;

			expect(
				new errors.InvalidNumberOfParamsError(got, expected, 'method').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.ConnectionError('error message', {
					code: 10,
					reason: 'reason',
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('InvalidConnectionError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.InvalidConnectionError('my host', {
					code: 10,
					reason: 'reason',
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionTimeoutError', () => {
		it('should have valid json structure', () => {
			const timeoutValue = 5000;

			expect(new errors.ConnectionTimeoutError(timeoutValue).toJSON()).toMatchSnapshot();
		});
	});

	describe('ConnectionNotOpenError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.ConnectionNotOpenError({ code: 10, reason: 'reason' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionCloseError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.ConnectionCloseError({ code: 10, reason: 'reason' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('MaxAttemptsReachedOnReconnectingError', () => {
		it('should have valid json structure', () => {
			expect(new errors.MaxAttemptsReachedOnReconnectingError().toJSON()).toMatchSnapshot();
		});
	});

	describe('PendingRequestsOnReconnectingError', () => {
		it('should have valid json structure', () => {
			expect(new errors.PendingRequestsOnReconnectingError().toJSON()).toMatchSnapshot();
		});
	});

	describe('InvalidProviderError', () => {
		it('should have valid json structure', () => {
			expect(new errors.InvalidProviderError('my url').toJSON()).toMatchSnapshot();
		});
	});

	describe('ResponseError', () => {
		it('should have valid json structure with data', () => {
			expect(
				new errors.ResponseError({
					id: 1,
					jsonrpc: '2.0',
					error: { code: 123, message: 'error message', data: { a: '10', b: '20' } },
				}).toJSON(),
			).toMatchSnapshot();
		});

		it('should have valid json structure without data', () => {
			expect(
				new errors.ResponseError({
					id: 1,
					jsonrpc: '2.0',
					error: { code: 123, message: 'error message', data: undefined },
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('InvalidResponseError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.InvalidResponseError({
					id: 1,
					jsonrpc: '2.0',
					error: { code: 123, message: 'error message', data: { a: '10', b: '20' } },
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.TransactionError('message', { attr1: 'attr1' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('RevertInstructionError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.RevertInstructionError('message', 'signature').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionRevertError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.TransactionRevertError('message', 'signature', {
					attr1: 'attr1',
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('NoContractAddressFoundError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.NoContractAddressFoundError({ attr1: 'attr1' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractCodeNotStoredError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.ContractCodeNotStoredError({ attr1: 'attr1' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionRevertedWithoutReasonError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.TransactionRevertedWithoutReasonError({ attr1: 'attr1' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionOutOfGasError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.TransactionOutOfGasError({ attr1: 'attr1' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ResolverMethodMissingError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.ResolverMethodMissingError('address', 'name').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractMissingABIError', () => {
		it('should have valid json structure', () => {
			expect(new errors.ContractMissingABIError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractOnceRequiresCallbackError', () => {
		it('should have valid json structure', () => {
			expect(new errors.ContractOnceRequiresCallbackError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractEventDoesNotExistError', () => {
		it('should have valid json structure', () => {
			expect(
				new errors.ContractEventDoesNotExistError('eventName').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractReservedEventError', () => {
		it('should have valid json structure', () => {
			expect(new errors.ContractReservedEventError('type').toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractMissingDeployDataError', () => {
		it('should have valid json structure', () => {
			expect(new errors.ContractMissingDeployDataError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractNoAddressDefinedError', () => {
		it('should have valid json structure', () => {
			expect(new errors.ContractNoAddressDefinedError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractNoFromAddressDefinedError', () => {
		it('should have valid json structure', () => {
			expect(new errors.ContractNoFromAddressDefinedError().toJSON()).toMatchSnapshot();
		});
	});
});
