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

const isValid = (str: string) => str !== undefined && str.trim().length > 0;

export class DRPCProvider extends Web3ExternalProvider {
	// eslint-disable-next-line default-param-last
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		token = 'Avj1DYpxRUOer0sLDhdUK_YiF4nikX4R77x3TgFkVp5j',
		host = 'lb.drpc.org',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, token, host, providerConfigOptions);
	}

	public static readonly networkStringMap: { [key: string]: string } = {
		[Network.ETH_MAINNET]: 'ethereum',
		[Network.ETH_SEPOLIA]: 'sepolia',
		[Network.ETH_HOLESKY]: 'holesky',

		[Network.ARBITRUM_MAINNET]: 'arbitrum',
		[Network.ARBITRUM_SEPOLIA]: 'arbitrum-sepolia',

		[Network.BNB_MAINNET]: 'bsc',
		[Network.BNB_TESTNET]: 'bsc-testnet',

		[Network.POLYGON_MAINNET]: 'polygon',
		[Network.POLYGON_AMONY]: 'polygon-amoy',

		[Network.ZKERA_MAINNET]: 'zksync',
		[Network.ZKERA_SEPOLIA]: 'zksync-sepolia',
	};

	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, _key: string, _host: string) {
		const networkString = DRPCProvider.networkStringMap[network] || '';
		if (!networkString) {
			throw new Error('Network info not available.');
		}

		let protocol = '';
		if (transport === Transport.HTTPS) {
			protocol = 'rpc';
		} else if (transport === Transport.WebSocket) {
			protocol = 'ws';
		}

		const host = isValid(_host) ? _host : 'lb.drpc.org';
		const key = isValid(_key) ? _key : 'Avj1DYpxRUOer0sLDhdUK_YiF4nikX4R77x3TgFkVp5j';

		return `${transport}://${host}/og${protocol}?network=${networkString}&dkey=${key}&tag=web3js`;
	}
}
