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

import { HttpProviderOptions } from 'web3-providers-http';
import { Transport, Network, SocketOptions } from './types.js';
import { Web3ExternalProvider } from './web3_provider.js';

export class AnkrProvider extends Web3ExternalProvider {
	// eslint-disable-next-line default-param-last
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		key = 'ADD_KEY_HERE',
		host = 'rpc.ankr.com',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, key, host, providerConfigOptions);

		if (transport === Transport.WebSocket)
			throw new Error('Websocket is not avalible for Ankr free account.');
	}

	public static readonly networkStringMap: { [key: string]: string } = {
		[Network.ETH_MAINNET]: 'eth',
		[Network.ETH_SEPOLIA]: Network.ETH_SEPOLIA,
		[Network.ETH_HOLESKY]: Network.ETH_HOLESKY,
		[Network.ARBITRUM_MAINNET]: 'arbitrum',
		[Network.ARBITRUM_SEPOLIA]: Network.ARBITRUM_SEPOLIA,
		[Network.BNB_MAINNET]: 'bsc',
		[Network.BNB_TESTNET]: 'bsc_testnet_chapel',
		[Network.POLYGON_MAINNET]: 'polygon',
		[Network.POLYGON_AMOY]: Network.POLYGON_AMOY,
	};

	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, key: string, host: string) {
		const networkString = AnkrProvider.networkStringMap[network] || '';
		if (!networkString) {
			throw new Error('Network info not available.');
		}

		return `${transport}://${host}/${networkString}/${key}`;
	}
}
