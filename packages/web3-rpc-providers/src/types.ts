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

import { ClientOptions, ClientRequestArgs } from 'web3-providers-ws';
import { ReconnectOptions } from 'web3-utils';

export enum Transport {
	HTTPS = 'https',
	WebSocket = 'wss',
}

export enum Network {
	ETH_MAINNET = 'eth_mainnet',
	ETH_GOERLI = 'eth_goerli',
	ETH_SEPOLIA = 'eth_sepolia',
	ETH_HOLESKY = 'eth_holesky',

	POLYGON_MAINNET = 'polygon_mainnet',
	POLYGON_MUMBAI = 'polygon_mumbai',
	POLYGON_AMONY = 'polygon_amony',
	POLYGON_AMOY = 'polygon_amoy',
	POLYGON_POS_MAINNET = 'polygon_pos_mainnet',
	POLYGON_ZKEVM_MAINNET = 'polygon_zkevm_mainnet',
	POLYGON_ZKEVM_CARDONA = 'polygon_zkevm_cardona',

	ARBITRUM_MAINNET = 'arbitrum_mainnet',
	ARBITRUM_SEPOLIA = 'arbitrum_sepolia',
	ARBITRUM_NOVA_MAINNET = 'arbitrum_nova_mainnet',

	BASE_MAINNET = 'base_mainnet',
	BASE_SEPOLIA = 'base_sepolia',

	OPTIMISM_MAINNET = 'optimism_mainnet',
	OPTIMISM_SEPOLIA = 'optimism_sepolia',

	BNB_MAINNET = 'bnb_mainnet',
	BNB_TESTNET = 'bnb_testnet',

	WORLD_CHAIN_MAINNET = 'world_chain_mainnet',
	WORLD_CHAIN_SEPOLIA = 'world_chain_sepolia',

	SHAPE_MAINNET = 'shape_mainnet',
	SHAPE_SEPOLIA = 'shape_sepolia',

	ZKSYNC_MAINNET = 'zksync_mainnet',
	ZKSYNC_SEPOLIA = 'zksync_sepolia',

	STARKNET_MAINNET = 'starknet_mainnet',
	STARKNET_SEPOLIA = 'starknet_sepolia',

	ZETACHAIN_MAINNET = 'zetachain_mainnet',
	ZETACHAIN_TESTNET = 'zetachain_testnet',

	FANTOM_OPERA_MAINNET = 'fantom_opera_mainnet',
	FANTOM_OPERA_TESTNET = 'fantom_opera_testnet',

	MANTLE_MAINNET = 'mantle_mainnet',

	BERACHAIN_ARTIO = 'berachain_artio',

	BLAST_MAINNET = 'blast_mainnet',
	BLAST_SEPOLIA = 'blast_sepolia',

	LINEA_MAINNET = 'linea_mainnet',
	LINEA_SEPOLIA = 'linea_sepolia',

	ZORA_MAINNET = 'zora_mainnet',
	ZORA_SEPOLIA = 'zora_sepolia',

	POLYNOMIAL_MAINNET = 'polynomial_mainnet',
	POLYNOMIAL_SEPOLIA = 'polynomial_sepolia',

	SCROLL_MAINNET = 'scroll_mainnet',
	SCROLL_SEPOLIA = 'scroll_sepolia',

	FRAX_MAINNET = 'frax_mainnet',
	FRAX_SEPOLIA = 'frax_sepolia',

	SOLANA_MAINNET = 'solana_mainnet',
	SOLANA_DEVNET = 'solana_devnet',

	OPBNB_MAINNET = 'opbnb_mainnet',
	OPBNB_TESTNET = 'opbnb_testnet',

	CROSSFI_TESTNET = 'crossfi_testnet',

	ASTAR_MAINNET = 'astar_mainnet',

	FLOW_EVM_TESTNET = 'flow_evm_testnet',

	SONEIUM_MINATO = 'soneium_minato',

	GEIST_POLTER = 'geist_polter',

	ROOTSTOCK_MAINNET = 'rootstock_mainnet',
	ROOTSTOCK_TESTNET = 'rootstock_testnet',

	UNICHAIN_SEPOLIA = 'unichain_sepolia',

	GNOSIS_MAINNET = 'gnosis_mainnet',
}

// Combining the ws types
export type SocketOptions = {
	socketOptions?: ClientOptions | ClientRequestArgs;
	reconnectOptions?: Partial<ReconnectOptions>;
};
