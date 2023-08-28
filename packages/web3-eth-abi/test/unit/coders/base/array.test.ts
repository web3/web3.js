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

import { extractArrayType } from '../../../../src/coders/utils';

describe('abi - coder - base - array', () => {
	describe('extractArrayType', () => {
		it('should work for dynamic array', () => {
			expect(extractArrayType({ type: 'uint256[]', name: '' })).toEqual({
				param: { type: 'uint256', name: '' },
				size: -1,
			});
		});
		it('should work for 2d array', () => {
			expect(extractArrayType({ type: 'uint256[][]', name: '' })).toEqual({
				param: { type: 'uint256[]', name: '' },
				size: -1,
			});
		});
		it('should work for fixed size array', () => {
			expect(extractArrayType({ type: 'uint256[2]', name: '' })).toEqual({
				param: { type: 'uint256', name: '' },
				size: 2,
			});
			expect(extractArrayType({ type: 'uint256[0]', name: '' })).toEqual({
				param: { type: 'uint256', name: '' },
				size: 0,
			});
		});
		it('should fail for invalid array size', () => {
			expect(() => extractArrayType({ type: 'uint256[2q]', name: '' })).toThrow();
		});
	});
});
