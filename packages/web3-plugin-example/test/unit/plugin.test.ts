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
import Web3 from 'web3';

import { ChainlinkPlugin } from '../../src/index';
import { AggregatorV3InterfaceABI } from '../../src/aggregator_v3_interface_abi';

const aggregatorAddress = '0xECe365B379E1dD183B20fc5f022230C044d51404';

describe('Chainlink Plugin Tests', () => {
	it('should register ChainlinkPlugin and make the getPrice call', async () => {
		const web3 = new Web3('https://rpc.ankr.com/eth_rinkeby');
		web3.registerPlugin(new ChainlinkPlugin(AggregatorV3InterfaceABI, aggregatorAddress));
		const price = await web3.chainlink.getPrice();
		expect(Object.keys(price)).toEqual(
			expect.arrayContaining([
				'roundId',
				'answer',
				'startedAt',
				'updatedAt',
				'answeredInRound',
			]),
		);
	});
});
