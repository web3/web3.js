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

import { JsonRpcIdentifier } from 'web3-types';

import * as rpcErrors from '../../src/errors/rpc_errors';
import { RpcErrorMessages } from '../../src/errors/rpc_error_messages';

const rpcReturnedError = {
	id: 1,
	jsonrpc: '2.0' as JsonRpcIdentifier,
	error: { code: 123, message: 'error message', data: { a: '10', b: '20' } },
};

describe('rpc errors', () => {
	describe('rpcErrorsMap', () => {
		it('child RpcError classes should be also mapped inside `rpcErrorsMap`', () => {
			expect(
				Object.values(rpcErrors).filter(
					err =>
						(err as any).prototype?.constructor?.prototype instanceof
						rpcErrors.RpcError,
				),
			).toHaveLength(rpcErrors.rpcErrorsMap.size);
		});
	});

	describe('rpcErrors.RpcError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.RpcError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
		it('test constructor with custom message', () => {
			expect(
				new rpcErrors.RpcError(rpcReturnedError, `some message`).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('EIP1193ProviderRpcError', () => {
		it('test constructor with no code', () => {
			expect(
				new rpcErrors.EIP1193ProviderRpcError(undefined as unknown as number).toJSON(),
			).toMatchSnapshot();
		});
		it('test constructor with a known code (1000)', () => {
			const code = 1000;
			const error = new rpcErrors.EIP1193ProviderRpcError(code);
			expect(error.toJSON()).toMatchSnapshot();
			expect(error.message).toEqual(RpcErrorMessages[code].message);
		});
		it('test constructor with un registered code', () => {
			expect(new rpcErrors.EIP1193ProviderRpcError(99999).toJSON()).toMatchSnapshot();
		});
	});

	describe('ParseError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.ParseError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('InvalidRequestError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.InvalidRequestError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('MethodNotFoundError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.MethodNotFoundError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('InvalidParamsError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.InvalidParamsError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('InternalError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.InternalError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('InvalidInputError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.InvalidInputError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('MethodNotSupported', () => {
		it('test constructor', () => {
			expect(new rpcErrors.MethodNotSupported(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});

	describe('ResourceUnavailableError', () => {
		it('test constructor', () => {
			expect(
				new rpcErrors.ResourceUnavailableError(rpcReturnedError).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('ResourcesNotFoundError', () => {
		it('test constructor', () => {
			expect(
				new rpcErrors.ResourcesNotFoundError(rpcReturnedError).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('VersionNotSupportedError', () => {
		it('test constructor', () => {
			expect(
				new rpcErrors.VersionNotSupportedError(rpcReturnedError).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('TransactionRejectedError', () => {
		it('test constructor', () => {
			expect(
				new rpcErrors.TransactionRejectedError(rpcReturnedError).toJSON(),
			).toMatchSnapshot();
		});
	});

	describe('LimitExceededError', () => {
		it('test constructor', () => {
			expect(new rpcErrors.LimitExceededError(rpcReturnedError).toJSON()).toMatchSnapshot();
		});
	});
});
