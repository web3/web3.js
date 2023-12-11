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

import { BaseWeb3Error, MultipleErrors } from '../../src/web3_error_base';

class CustomError extends BaseWeb3Error {
	public code = 0;
}
describe('BaseWeb3Error', () => {
	it('innerError is readable from cause', () => {
		const error = new CustomError('outer error');
		const innerError = new Error('inner error');
		error.cause = innerError;
		// eslint-disable-next-line deprecation/deprecation
		expect(error.innerError).toBe(innerError);
	});
	it('case is set from innerError', () => {
		const error = new CustomError('outer error');
		const cause = new Error('inner error');
		// eslint-disable-next-line deprecation/deprecation
		error.innerError = cause;
		expect(error.cause).toBe(cause);
	});
	it('case is set from innerError array', () => {
		const error = new CustomError('outer error');
		const innerErrors = [new Error('inner error1'), new Error('inner error2')];
		// eslint-disable-next-line deprecation/deprecation
		error.innerError = innerErrors;
		expect((error.cause as MultipleErrors).errors).toBe(innerErrors);
	});
	it('case is set from array of errors at the constructor', () => {
		const innerErrors = [new Error('inner error1'), new Error('inner error2')];
		const error = new CustomError('outer error', innerErrors);
		expect((error.cause as MultipleErrors).errors).toBe(innerErrors);
	});
});
