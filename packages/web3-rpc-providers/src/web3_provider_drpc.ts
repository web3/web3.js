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

export class DRPCProvider extends Web3ExternalProvider {
	// eslint-disable-next-line default-param-last
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		token = 'TEST_TOKEN',
		host = 'lb.drpc.org',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, token, host, providerConfigOptions);
	}

	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, key: string, host: string) {
		let networkString = '';

		switch (network) {
			case Network.ETH_MAINNET:
				networkString = 'ethereum';
				break;
			case Network.ETH_SEPOLIA:
				networkString = 'sepolia';
				break;
			case Network.ETH_HOLESKY:
				networkString = 'holesky';
				break;

			case Network.ARBITRUM_MAINNET:
				networkString = 'arbitrum';
				break;
			case Network.ARBITRUM_SEPOLIA:
				networkString = 'arbitrum-sepolia';
				break;

			case Network.BNB_MAINNET:
				networkString = 'bsc';
				break;
			case Network.BNB_TESTNET:
				networkString = 'bsc-testnet';
				break;

			case Network.POLYGON_MAINNET:
				networkString = 'polygon';
				break;
			case Network.POLYGON_AMONY:
				networkString = 'polygon-amoy';
				break;

			case Network.ZKERA_MAINNET:
				networkString = 'zksync';
				break;

			case Network.ZKERA_SEPOLIA:
				networkString = 'zksync-sepolia';
				break;

			default:
				throw new Error('Network info not available.');
		}

		let protocol = '';

		if (transport === Transport.HTTPS) {
			protocol = 'rpc';
		} else if (transport === Transport.WebSocket) {
			protocol = 'ws';
		}

		return `${transport}://${host}/og${protocol}?network=${networkString}&dkey=${key}`;
	}
}
