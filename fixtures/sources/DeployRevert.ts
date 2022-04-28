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
export const deployRevertByteCode =
	'0x6080604052348015600f57600080fd5b506000601a57600080fd5b603f8060276000396000f3fe6080604052600080fdfea2646970667358221220bd4503b0171d547f437e87e066ac1e967afdde3a3c7e227ed5e414684011238664736f6c634300080d0033';

<<<<<<< HEAD:fixtures/sources/DeployRevert.ts
export const deployRevertAbi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
] as const;
=======
type Account = {
	address: string;
	privateKey: string;
	balance: string;
};

export const accounts: Account[] = [
	{
		address: '0xdc6bad79dab7ea733098f66f6c6f9dd008da3258',
		privateKey: '0x4c3758228f536f7a210f8936182fb5b728046970b8e3215d0b5cb4c4faae8a4e',
		balance: '100',
	},
	{
		address: '0x962f9a9c2a6c092474d24def35eccb3d9363265e',
		privateKey: '0x34aeb1f338c17e6b440c189655c89fcef148893a24a7f15c0cb666d9cf5eacb3',
		balance: '100',
	},
	{
		address: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
		privateKey: '0x6a56d57b7d8ba43929e84234c576587bbb2526a57b3e3823b0c97065767985fc',
		balance: '100',
	},
];
export const clientUrl = 'http://localhost:8545';
export const clientWsUrl = 'ws://localhost:8545';
>>>>>>> fafca127e (adding account to fix ganache tests):.github/test.config.ts
