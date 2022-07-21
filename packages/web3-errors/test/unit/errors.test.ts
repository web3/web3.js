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

import * as accountErrors from '../../src/errors/account_errors';
import * as connectionErrors from '../../src/errors/connection_errors';
import * as contractErrors from '../../src/errors/contract_errors';
import * as ensErrors from '../../src/errors/ens_errors';
import * as genericErrors from '../../src/errors/generic_errors';
import * as providerErrors from '../../src/errors/provider_errors';
import * as signatureErrors from '../../src/errors/signature_errors';
import * as transactionErrors from '../../src/errors/transaction_errors';
import * as utilsErrors from '../../src/errors/utils_errors';
import * as responseErrors from '../../src/errors/response_errors';

import { ConvertValueToString } from '../fixtures/errors';
import { Web3Error } from '../../src/web3_error_base';

describe('errors', () => {
	describe('error convertToString', () => {
		it.each(ConvertValueToString)('%s', (input, output) => {
			expect(Web3Error.convertToString(input, true)).toEqual(output);
		});
	});

	it('should have unique codes for each error', () => {
		const errorCodes: number[] = [];

		for (const ErrorClass of Object.values({
			...accountErrors,
			...connectionErrors,
			...contractErrors,
			...ensErrors,
			...genericErrors,
			...providerErrors,
			...signatureErrors,
			...transactionErrors,
			...utilsErrors,
		})) {
			// To disable error for the abstract class

			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			const err = new ErrorClass({} as never, {} as never, {} as never);
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
				new genericErrors.InvalidNumberOfParamsError(got, expected, 'method').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionError', () => {
		it('should have valid json structure', () => {
			expect(
				new connectionErrors.ConnectionError('error message', {
					code: 10,
					reason: 'reason',
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('InvalidConnectionError', () => {
		it('should have valid json structure', () => {
			expect(
				new connectionErrors.InvalidConnectionError('my host', {
					code: 10,
					reason: 'reason',
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionTimeoutError', () => {
		it('should have valid json structure', () => {
			const timeoutValue = 5000;

			expect(
				new connectionErrors.ConnectionTimeoutError(timeoutValue).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionNotOpenError', () => {
		it('should have valid json structure', () => {
			expect(
				new connectionErrors.ConnectionNotOpenError({
					code: 10,
					reason: 'reason',
				}).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ConnectionCloseError', () => {
		it('should have valid json structure', () => {
			expect(
				new connectionErrors.ConnectionCloseError({ code: 10, reason: 'reason' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('MaxAttemptsReachedOnReconnectingError', () => {
		it('should have valid json structure', () => {
			expect(
				new connectionErrors.MaxAttemptsReachedOnReconnectingError().toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('PendingRequestsOnReconnectingError', () => {
		it('should have valid json structure', () => {
			expect(
				new connectionErrors.PendingRequestsOnReconnectingError().toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('InvalidProviderError', () => {
		it('should have valid json structure', () => {
			expect(new providerErrors.InvalidProviderError('my url').toJSON()).toMatchSnapshot();
		});
	});

	describe('TransactionError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.TransactionError('message', { attr1: 'attr1' }).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('RevertInstructionError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.RevertInstructionError('message', 'signature').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionRevertError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.TransactionRevertError('message', 'signature', {
					attr1: 'attr1',
				} as any).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('NoContractAddressFoundError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.NoContractAddressFoundError({
					attr1: 'attr1',
				} as any).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractCodeNotStoredError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.ContractCodeNotStoredError({
					attr1: 'attr1',
				} as any).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionRevertedWithoutReasonError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.TransactionRevertedWithoutReasonError({
					attr1: 'attr1',
				} as any).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionOutOfGasError', () => {
		it('should have valid json structure', () => {
			expect(
				new transactionErrors.TransactionOutOfGasError({ attr1: 'attr1' } as any).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ResolverMethodMissingError', () => {
		it('should have valid json structure', () => {
			expect(
				new contractErrors.ResolverMethodMissingError('address', 'name').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractMissingABIError', () => {
		it('should have valid json structure', () => {
			expect(new contractErrors.ContractMissingABIError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractOnceRequiresCallbackError', () => {
		it('should have valid json structure', () => {
			expect(
				new contractErrors.ContractOnceRequiresCallbackError().toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractEventDoesNotExistError', () => {
		it('should have valid json structure', () => {
			expect(
				new contractErrors.ContractEventDoesNotExistError('eventName').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractReservedEventError', () => {
		it('should have valid json structure', () => {
			expect(
				new contractErrors.ContractReservedEventError('type').toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ContractMissingDeployDataError', () => {
		it('should have valid json structure', () => {
			expect(new contractErrors.ContractMissingDeployDataError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractNoAddressDefinedError', () => {
		it('should have valid json structure', () => {
			expect(new contractErrors.ContractNoAddressDefinedError().toJSON()).toMatchSnapshot();
		});
	});

	describe('ContractNoFromAddressDefinedError', () => {
		it('should have valid json structure', () => {
			expect(
				new contractErrors.ContractNoFromAddressDefinedError().toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ResponseError', () => {
		it('should have valid json structure with data', () => {
			expect(
				new responseErrors.ResponseError({
					id: 1,
					jsonrpc: '2.0',
					error: { code: 123, message: 'error message', data: { a: '10', b: '20' } },
				}).toJSON(),
			).toMatchSnapshot();
		});

		it('should have valid json structure without data', () => {
			expect(
				new responseErrors.ResponseError({
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
				new responseErrors.InvalidResponseError({
					id: 1,
					jsonrpc: '2.0',
					error: { code: 123, message: 'error message', data: { a: '10', b: '20' } },
				}).toJSON(),
			).toMatchSnapshot();
		});
	});
});
