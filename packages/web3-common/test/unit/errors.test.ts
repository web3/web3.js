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

import * as errors from '../../src/index';

describe('errors', () => {
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
});
