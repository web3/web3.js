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

import { mainnet, Network, QuickNodeProvider, Transport, DRPCProvider } from 'web3-rpc-providers';
import { Web3 } from '../../src/index';

describe('Web3 RPC Provider Integration tests', () => {
	const transports = Object.values(Transport);
	const networks = [
		Network.ETH_MAINNET,
		Network.ETH_HOLESKY,
		Network.ETH_SEPOLIA,
		Network.ARBITRUM_MAINNET,
		Network.ARBITRUM_SEPOLIA,
		Network.BNB_MAINNET,
		Network.BNB_TESTNET,
		Network.POLYGON_MAINNET,
		Network.POLYGON_AMONY,
		Network.ZKERA_MAINNET,
		Network.ZKERA_SEPOLIA,
	];

	transports.forEach(transport => {
		networks.forEach(network => {
			if (network !== Network.ZKERA_MAINNET && network !== Network.ZKERA_SEPOLIA) {
				it(`QuickNodeProvider should work with ${transport} transport and ${network} network`, async () => {
					const provider = new QuickNodeProvider(network, transport);
					const web3 = new Web3(provider);
					const result = await web3.eth.getBlockNumber();

					expect(typeof result).toBe('bigint');
					expect(result > 0).toBe(true);

					if (transport === Transport.WebSocket) {
						web3.provider?.disconnect();
					}
				});
			}

			it(`dRPC Provider should work with ${transport} transport and ${network} network`, async () => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				const provider = new DRPCProvider(network, transport);
				const web3 = new Web3(provider);
				const result = await web3.eth.getBlockNumber();

				expect(typeof result).toBe('bigint');
				expect(result > 0).toBe(true);

				if (transport === Transport.WebSocket) {
					web3.provider?.disconnect();
				}
			});
		});
	});
	it(`should work with mainnet provider`, async () => {
		const web3 = new Web3(mainnet);
		const result = await web3.eth.getBlockNumber();
		expect(typeof result).toBe('bigint');
		expect(result > 0).toBe(true);
	});

	it(`should work with default provider`, async () => {
		const web3 = new Web3();
		const result = await web3.eth.getBlockNumber();
		expect(typeof result).toBe('bigint');
		expect(result > 0).toBe(true);
	});

	it(`Web3 default provider should always be connected with Eth mainnet`, async () => {
		const web3 = new Web3();
		const chainID = await web3.eth.getChainId();
		expect(typeof chainID).toBe('bigint');
		expect(chainID).toBe(BigInt(1));

		const NWID = await web3.eth.net.getId();
		expect(typeof NWID).toBe('bigint');
		expect(NWID).toBe(BigInt(1));
	});
});
