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
import { AbiConstructorFragment, AbiFunctionFragment, ContractOptions } from 'web3-types';
// eslint-disable-next-line
import { getSendTxParams, getEthTxCallParams } from 'web3-eth-contract';
import { BasicAbi, BasicBytecode } from '../shared_fixtures/build/Basic';
import accounts from '../shared_fixtures/accounts.json';

const abiConstructor = BasicAbi.find(j => j.type === 'constructor') as AbiConstructorFragment;
const abiSendMethod = BasicAbi.find(
	j => j.type === 'function' && j.name === 'firesMultiValueEvent',
) as AbiFunctionFragment;
const abiCallMethod = BasicAbi.find(
	j => j.type === 'function' && j.name === 'getBoolValue',
) as AbiFunctionFragment;

export const processingContractDeploy = async () => {
	return getSendTxParams({
		abi: abiConstructor,
		params: [1123, 'asdasd'],
		options: { dataInputFill: 'data', data: BasicBytecode },
		contractOptions: { from: accounts[0].address } as ContractOptions,
	});
};

export const processingContractMethodSend = async () => {
	return getSendTxParams({
		abi: abiSendMethod,
		params: ['asdasd', 1123, true],
		options: { dataInputFill: 'data', to: accounts[1].address },
		contractOptions: { from: accounts[0].address } as ContractOptions,
	});
};

export const processingContractMethodCall = async () => {
	return getEthTxCallParams({
		abi: abiCallMethod,
		params: [],
		options: { dataInputFill: 'data', to: accounts[1].address },
		contractOptions: { from: accounts[0].address } as ContractOptions,
	});
};
