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

import { ethRpcMethods } from 'web3-rpc-methods';

import Web3Eth from '../../src/index';

jest.mock('web3-rpc-methods');

describe('Web3Eth.calculateFeeData', () => {
	let web3Eth: Web3Eth;

	beforeAll(() => {
		web3Eth = new Web3Eth('http://127.0.0.1:8545');
	});

	it('should return call getBlockByNumber, getGasPrice and getMaxPriorityFeePerGas', async () => {
		await web3Eth.calculateFeeData();
		// web3Eth.getBlock = jest.fn();
		expect(ethRpcMethods.getBlockByNumber).toHaveBeenCalledWith(
			web3Eth.requestManager,
			'latest',
			false,
		);
		expect(ethRpcMethods.getGasPrice).toHaveBeenCalledWith(web3Eth.requestManager);
		expect(ethRpcMethods.getMaxPriorityFeePerGas).toHaveBeenCalledWith(web3Eth.requestManager);
	});

	it('should calculate fee data', async () => {
		const gasPrice = BigInt(20 * 1000);
		const baseFeePerGas = BigInt(1000);
		const maxPriorityFeePerGas = BigInt(100);
		const baseFeePerGasFactor = BigInt(3);

		jest.spyOn(ethRpcMethods, 'getBlockByNumber').mockReturnValueOnce({ baseFeePerGas } as any);
		jest.spyOn(ethRpcMethods, 'getGasPrice').mockReturnValueOnce(gasPrice as any);
		// eslint-disable-next-line @typescript-eslint/no-unsafe-call
		jest.spyOn(ethRpcMethods, 'getMaxPriorityFeePerGas').mockReturnValueOnce(
			maxPriorityFeePerGas as any,
		);

		const feeData = await web3Eth.calculateFeeData(baseFeePerGasFactor, maxPriorityFeePerGas);
		expect(feeData).toMatchObject({
			gasPrice,
			maxFeePerGas: baseFeePerGas * baseFeePerGasFactor + maxPriorityFeePerGas,
			maxPriorityFeePerGas,
			baseFeePerGas,
		});
	});

	it('should calculate fee data based on `alternativeMaxPriorityFeePerGas` if `getMaxPriorityFeePerGas` did not return a value', async () => {
		const gasPrice = BigInt(20 * 1000);
		const baseFeePerGas = BigInt(1000);
		const alternativeMaxPriorityFeePerGas = BigInt(700);
		const baseFeePerGasFactor = BigInt(3);

		jest.spyOn(ethRpcMethods, 'getBlockByNumber').mockReturnValueOnce({ baseFeePerGas } as any);
		jest.spyOn(ethRpcMethods, 'getGasPrice').mockReturnValueOnce(gasPrice as any);
		const feeData = await web3Eth.calculateFeeData(
			baseFeePerGasFactor,
			alternativeMaxPriorityFeePerGas,
		);
		expect(feeData).toMatchObject({
			gasPrice,
			maxFeePerGas: baseFeePerGas * baseFeePerGasFactor + alternativeMaxPriorityFeePerGas,
			maxPriorityFeePerGas: alternativeMaxPriorityFeePerGas,
			baseFeePerGas,
		});
	});

	it('should use default baseFeePerGasFactor if none is provided', async () => {
		const gasPrice = BigInt(20 * 1000);
		const baseFeePerGas = BigInt(1000);
		const maxPriorityFeePerGas = BigInt(100); // this will be used directly

		jest.spyOn(ethRpcMethods, 'getBlockByNumber').mockReturnValueOnce({ baseFeePerGas } as any);
		jest.spyOn(ethRpcMethods, 'getGasPrice').mockReturnValueOnce(gasPrice as any);
		jest.spyOn(ethRpcMethods, 'getMaxPriorityFeePerGas').mockReturnValueOnce(
			maxPriorityFeePerGas as any,
		);

		const feeData = await web3Eth.calculateFeeData(); // no baseFeePerGasFactor passed
		const defaultBaseFeePerGasFactor = BigInt(2);
		expect(feeData).toMatchObject({
			gasPrice,
			maxFeePerGas: baseFeePerGas * defaultBaseFeePerGasFactor + maxPriorityFeePerGas,
			maxPriorityFeePerGas,
			baseFeePerGas,
		});
	});
});
