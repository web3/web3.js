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

export const accounts: Account[] = [
	{
		// ganache account for personal tests
		address: '0x1337C75FdF978ABABaACC038A1dCd580FeC28ab2',
		privateKey: '0x6a56d57b7d8ba43929e84234c576587bbb2526a57b3e3823b0c97065767985fc',
		balance: '100',
	},
	{
		// geth account for personal tests send transaction
		address: '0x420ab031E4EbCD4E7f0C198D344dd954Df1ca4b9',
		privateKey: '0x9e0c4d12677882ddf99775ce67305206c08e8db25f49902316771e5d0d27c08a',
		balance: '100',
	},
	{
		// geth account for sign test
		address: '0x62FF0b7cfD7c46E2D647359608592AE91Ed2Faad',
		privateKey: 'c8a91240e0f1fc62562321a98ab5d519d00da6fd2a317e0ce63464ef3b8b51eb',
		balance: '100',
	},
	{
		// ganache account for unlock
		address: '0x3Ff604a10c7B41feB32766015c4D15F33F4d770A',
		privateKey: '0x86921161f792f7df00e6108a79ef556cddf50ac899fd8f59d2ff079d32876360',
		balance: '100',
	},
	{
		// geth
		address: '0xcE6859c4891bd2552C3090FA6Fb701479B2571CC',
		privateKey: 'eb1ef1c6b1bffa4e118f1769420107a5076ee36b4741ecae29329ae7278d8cb7',
		balance: '100',
	},
	{
		// ganache import key
		address: '0x984541a42E0a07E9Ace3c692f69dB54f4719814d',
		privateKey: '0x696e44dde8c7517f8cefdf58dae0640bc0b642221927ab8b4dea336dda4fe27c',
		balance: '100',
	},
];
export const clientUrl = 'http://localhost:8545';
export const clientWsUrl = 'ws://localhost:8545';
