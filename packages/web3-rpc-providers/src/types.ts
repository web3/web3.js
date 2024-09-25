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
	ETH_SEPOLIA = 'eth_sepolia',
	ETH_GOERLI = 'eth_goerli',
	ETH_HOLESKY = 'eth_holesky',

	PALM_MAINNET = 'palm_mainnet',
	PALM_TESTNET = 'palm_testnet',

	BLAST_MAINNET = 'blast_mainnet',
	BLAST_SEPOLIA = 'blast_sepolia',

	STARKNET_MAINNET = 'starknet_mainnet',
	STARKNET_SEPOLIA = 'starknet_sepolia',

	ZKSYNC_MAINNET = 'zksync_mainnet',
	ZKSYNC_SEPOLIA = 'zksync_sepolia',

	CELO_MAINNET = 'celo_mainnet',
	CELO_ALFAJORES = 'celo_alfajores',

	AVALANCHE_MAINNET = 'avalanche_mainnet',
	AVALANCHE_FUJI = 'avalanche_fuji',

	POLYGON_MAINNET = 'polygon_mainnet',
	POLYGON_MUMBAI = 'polygon_mumbai',
	POLYGON_AMONY = 'polygon_amony',

	ARBITRUM_MAINNET = 'arbitrum_mainnet',
	ARBITRUM_SEPOLIA = 'arbitrum_sepolia',
	ARBITRUM_GOERLI = 'arbitrum_goerli',

	BASE_MAINNET = 'base_mainnet',
	BASE_SEPOLIA = 'base_sepolia',
	BASE_GOERLI = 'base_foerli',

	OPTIMISM_MAINNET = 'optimism_mainnet',
	OPTIMISM_SEPOLIA = 'optimism_sepolia',
	OPTIMISM_GOERLI = 'optimism_goerli',

	BNB_MAINNET = 'bnb_mainnet',
	BNB_TESTNET = 'bnb_testnet',

	BSC_MAINNET = 'bsc_mainnet',
	BSC_TESTNET = 'bsc_testnet',

	MANTLE_MAINNET = 'mantle_mainnet',
	MANTLE_SEPOLIA = 'mantle_sepolia',

	LINEA_MAINNET = 'linea_mainnet',
	LINEA_SEPOLIA = 'linea_sepolia',
	LINEA_GOERLI = 'linea_goerli',
}

// Combining the ws types
export type SocketOptions = {
	socketOptions?: ClientOptions | ClientRequestArgs;
	reconnectOptions?: Partial<ReconnectOptions>;
};
