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
/* eslint-disable import/no-relative-packages */
import Web3 from 'web3';
import Contract from 'web3-eth-contract';

import {
	closeOpenConnection,
	describeIf,
	getSystemTestBackend,
	isWs,
	getSystemTestProvider,
	createNewAccount,
	BACKEND,
} from '../../../shared_fixtures/system_tests_utils';
import { ERC20TokenAbi, ERC20TokenBytecode } from '../../../shared_fixtures/contracts/ERC20Token';

describeIf(getSystemTestBackend() === BACKEND.INFURA)(
	'ESM - Black Box Unit Tests - web3.eth.Contract',
	() => {
		describe('Infura - ERC20', () => {
			const mainNetUSDTAddress = '0xdAC17F958D2ee523a2206206994597C13D831ec7';

			let web3: Web3;

			beforeAll(() => {
				web3 = new Web3(getSystemTestProvider());
			});

			it('should get deployed contract info', async () => {
				const contract = new web3.eth.Contract(ERC20TokenAbi, mainNetUSDTAddress);

				expect(await contract.methods.name().call()).toBe('Tether USD');
				expect(await contract.methods.symbol().call()).toBe('USDT');
				expect(await contract.methods.decimals().call()).toBe(BigInt(6));
			});
		});
	},
);

describeIf(getSystemTestBackend() === BACKEND.GETH || getSystemTestBackend() === BACKEND.HARDHAT)(
	'Black Box Unit Tests - web3.eth.Contract',
	() => {
		describe('Geth || Hardhat - ERC20', () => {
			let account;
			let web3: Web3;
			let deployedContract: Contract<typeof ERC20TokenAbi>;

			beforeAll(async () => {
				account = await createNewAccount({
					unlock: true,
					refill: true,
					doNotImport: false,
				});

				web3 = new Web3(getSystemTestProvider());
				deployedContract = await new web3.eth.Contract(ERC20TokenAbi)
					.deploy({
						data: ERC20TokenBytecode,
						arguments: ['420'],
					})
					.send({ from: account.address, gas: '10000000' });
			});

			afterAll(async () => {
				if (isWs) await closeOpenConnection(web3);
			});

			it('should get deployed contract info', async () => {
				const contract = new web3.eth.Contract(
					ERC20TokenAbi,
					deployedContract.options.address,
				);

				expect(await contract.methods.name().call()).toBe('Gold');
				expect(await contract.methods.symbol().call()).toBe('GLD');
				expect(await contract.methods.decimals().call()).toBe(BigInt(18));
				expect(await contract.methods.totalSupply().call()).toBe(BigInt(420));
			});
		});
	},
);
