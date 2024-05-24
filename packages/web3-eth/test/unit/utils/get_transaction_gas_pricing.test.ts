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
import { Web3Context } from 'web3-core';

import { FMT_BYTES, FMT_NUMBER } from 'web3-types';
import * as RpcMethodWrappers from '../../../src/rpc_method_wrappers';
import { getTransactionGasPricing } from '../../../src/utils/get_transaction_gas_pricing';

describe('getTransactionGasPricing', () => {
	const web3Context = new Web3Context();

	it('should use the call rpc wrapper', async () => {
		const gasPrice = '0x123456';
		const gasPriceSpy = jest
			.spyOn(RpcMethodWrappers, 'getGasPrice')
			.mockImplementation(async () => gasPrice);
		const getBlockSpy = jest
			.spyOn(RpcMethodWrappers, 'getBlock')
			// @ts-expect-error only for testing purposes
			.mockImplementation(async () => ({
				baseFeePerGas: '0x0',
			}));

		const transaction = {
			from: '0x4fec0a51024b13030d26e70904b066c6d41157a5',
			to: '0x36361143b7e2c676f8ccd67743a89d26437f0529',
			data: '0x819f48fe',
			type: '0x2',
		};

		const res = await getTransactionGasPricing(transaction, web3Context, {
			number: FMT_NUMBER.HEX,
			bytes: FMT_BYTES.HEX,
		});

		expect(getBlockSpy).toHaveBeenCalled();
		expect(gasPriceSpy).toHaveBeenCalled();
		expect(res).toEqual({
			gasPrice: undefined,
			maxPriorityFeePerGas: gasPrice,
			maxFeePerGas: gasPrice,
		});
	});
});
