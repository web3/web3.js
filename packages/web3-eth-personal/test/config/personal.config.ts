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

type Account = {
	address: string;
	privateKey: string;
	balance: string;
};

export const importedAccount: Account = {
	// geth
	address: '0xcE6859c4891bd2552C3090FA6Fb701479B2571CC',
	privateKey: '0xeb1ef1c6b1bffa4e118f1769420107a5076ee36b4741ecae29329ae7278d8cb7',
	balance: '100',
};
