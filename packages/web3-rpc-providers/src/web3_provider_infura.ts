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

import { EthExecutionAPI, Web3APISpec } from 'web3-types';
import { HttpProviderOptions } from 'web3-providers-http';
import { Network, SocketOptions, Transport } from './types.js';
import { Web3ExternalProvider } from './web3_provider.js';

const isValid = (str: string) => str !== undefined && str.trim().length > 0;

export class InfuraProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3ExternalProvider<API> {
	// eslint-disable-next-line default-param-last
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		token = '',
		host = '',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, token, host, providerConfigOptions);
	}
	public static readonly networkHostMap: { [key: string]: string } = {
		[Network.PALM_MAINNET]: 'palm-mainnet.infura.io',
		[Network.PALM_TESTNET]: 'palm-testnet.infura.io',
		[Network.BLAST_MAINNET]: 'blast-mainnet.infura.io',
		[Network.BLAST_SEPOLIA]: 'blast-sepolia.infura.io',
		[Network.AVALANCHE_MAINNET]: 'avalanche-mainnet.infura.io',
		[Network.AVALANCHE_FUJI]: 'avalanche-fuji.infura.io',
		[Network.STARKNET_MAINNET]: 'starknet-mainnet.infura.io',
		[Network.STARKNET_SEPOLIA]: 'starknet-sepolia.infura.io',
		[Network.ZKSYNC_MAINNET]: 'zksync-mainnet.infura.io',
		[Network.ZKSYNC_SEPOLIA]: 'zksync-sepolia.infura.io',
		[Network.CELO_MAINNET]: 'celo-mainnet.infura.io',
		[Network.CELO_ALFAJORES]: 'celo-alfajores.infura.io',
		[Network.BSC_MAINNET]: 'bsc-mainnet.infura.io',
		[Network.BSC_TESTNET]: 'bsc-testnet.infura.io',
		[Network.MANTLE_MAINNET]: 'mantle-mainnet.infura.io',
		[Network.MANTLE_SEPOLIA]: 'mantle-sepolia.infura.io',
		[Network.ETH_MAINNET]: 'mainnet.infura.io',
		[Network.ETH_HOLESKY]: 'holesky.infura.io',
		[Network.ETH_SEPOLIA]: 'sepolia.infura.io',
		[Network.ARBITRUM_MAINNET]: 'arbitrum-mainnet.infura.io',
		[Network.ARBITRUM_SEPOLIA]: 'arbitrum-sepolia.infura.io',
		[Network.BASE_MAINNET]: 'base-mainnet.infura.io',
		[Network.BASE_SEPOLIA]: 'base-sepolia.infura.io',
		[Network.BNB_MAINNET]: 'opbnb-mainnet.infura.io',
		[Network.BNB_TESTNET]: 'opbnb-testnet.infura.io',
		[Network.LINEA_MAINNET]: 'linea-mainnet.infura.io',
		[Network.LINEA_SEPOLIA]: 'linea-sepolia.infura.io',
		[Network.POLYGON_MAINNET]: 'polygon-mainnet.infura.io',
		[Network.POLYGON_AMONY]: 'polygon-amoy.infura.io',
		[Network.OPTIMISM_MAINNET]: 'optimism-mainnet.infura.io',
		[Network.OPTIMISM_SEPOLIA]: 'optimism-sepolia.infura.io',
	};
	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, token: string, _host: string) {
		const defaultHost = InfuraProvider.networkHostMap[network];
		if (!defaultHost) {
			throw new Error('Network info not avalible.');
		}
		const host = isValid(_host) ? _host : defaultHost;

		return `${transport}://${host}/${
			transport === Transport.WebSocket ? 'ws/' : ''
		}v3/${token}`;
	}
}
