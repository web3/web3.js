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

import {
	mainnet,
	Network,
	QuickNodeProvider,
	Transport,
	AlchemyProvider,
} from 'web3-rpc-providers';
import { Web3 } from '../../src/index';

describe('Web3 RPC Provider Integration tests', () => {
	const transports = Object.values(Transport);
	const quickNodeNetworks = [
		Network.ETH_MAINNET,
		Network.ETH_HOLESKY,
		Network.ETH_SEPOLIA,
		Network.ARBITRUM_MAINNET,
		Network.ARBITRUM_SEPOLIA,
		Network.BNB_MAINNET,
		Network.BNB_TESTNET,
		Network.POLYGON_MAINNET,
		Network.POLYGON_AMONY,
	];

	transports.forEach(transport => {
		quickNodeNetworks.forEach(network => {
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
		});

		const alchemyNetworks = [
			Network.ETH_MAINNET,
			Network.ETH_SEPOLIA,
			Network.ETH_GOERLI,
			Network.ETH_HOLESKY,
			Network.ARBITRUM_MAINNET,
			Network.ARBITRUM_SEPOLIA,
			Network.ARBITRUM_NOVA_MAINNET,
			Network.BASE_MAINNET,
			Network.BASE_SEPOLIA,
			Network.POLYGON_MAINNET,
			Network.POLYGON_MUMBAI,
			Network.POLYGON_AMOY,
			Network.POLYGON_POS_MAINNET,
			Network.POLYGON_ZKEVM_MAINNET,
			Network.POLYGON_ZKEVM_CARDONA,
			Network.OPTIMISM_MAINNET,
			Network.OPTIMISM_SEPOLIA,
			Network.ASTAR_MAINNET,
			Network.WORLD_CHAIN_MAINNET,
			Network.WORLD_CHAIN_SEPOLIA,
			Network.SHAPE_MAINNET,
			Network.SHAPE_SEPOLIA,
			Network.ZKSYNC_MAINNET,
			Network.ZKSYNC_SEPOLIA,
			Network.STARKNET_MAINNET,
			Network.STARKNET_SEPOLIA,
			Network.ZETACHAIN_MAINNET,
			Network.ZETACHAIN_TESTNET,
			Network.FANTOM_OPERA_MAINNET,
			Network.FANTOM_OPERA_TESTNET,
			Network.MANTLE_MAINNET,
			Network.BERACHAIN_ARTIO,
			Network.BLAST_MAINNET,
			Network.BLAST_SEPOLIA,
			Network.LINEA_MAINNET,
			Network.LINEA_SEPOLIA,
			Network.ZORA_MAINNET,
			Network.ZORA_SEPOLIA,
			Network.POLYNOMIAL_MAINNET,
			Network.POLYNOMIAL_SEPOLIA,
			Network.SCROLL_MAINNET,
			Network.SCROLL_SEPOLIA,
			Network.FRAX_MAINNET,
			Network.FRAX_SEPOLIA,
			Network.SOLANA_MAINNET,
			Network.SOLANA_DEVNET,
			Network.CROSSFI_TESTNET,
			Network.FLOW_EVM_TESTNET,
			Network.SONEIUM_MINATO,
			Network.GEIST_POLTER,
			Network.ROOTSTOCK_MAINNET,
			Network.ROOTSTOCK_TESTNET,
			Network.UNICHAIN_SEPOLIA,
			Network.GNOSIS_MAINNET,
			Network.BNB_MAINNET,
			Network.BNB_TESTNET,
			Network.OPBNB_MAINNET,
			Network.OPBNB_TESTNET,
		];

		alchemyNetworks.forEach(network => {
			it(`AlchemyProvider should work with ${transport} transport and ${network} network`, async () => {
				const provider = new AlchemyProvider(network, transport);
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
});
