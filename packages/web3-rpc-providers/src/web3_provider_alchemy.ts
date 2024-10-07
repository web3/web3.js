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
import { Web3ExternalProvider } from './web3_provider.js';
import { Network, Transport, SocketOptions } from './types.js';

function isValid(value: string): boolean {
	return !!(value && value.trim().length > 0);
}

export class AlchemyProvider extends Web3ExternalProvider {
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		token = '',
		host = '',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, token, host, providerConfigOptions);
	}

	public static readonly networkStringMap: { [key: string]: string } = {
		[Network.ETH_MAINNET]: 'eth-mainnet.g.alchemy.com',
		[Network.ETH_SEPOLIA]: 'eth-sepolia.g.alchemy.com',
		[Network.ETH_GOERLI]: 'eth-goerli.g.alchemy.com',
		[Network.ARBITRUM_MAINNET]: 'arb-mainnet.g.alchemy.com',
		[Network.ARBITRUM_SEPOLIA]: 'arb-sepolia.g.alchemy.com',
		[Network.BASE_MAINNET]: 'base-mainnet.g.alchemy.com',
		[Network.BASE_SEPOLIA]: 'base-sepolia.g.alchemy.com',
		[Network.POLYGON_MAINNET]: 'polygon-mainnet.g.alchemy.com',
		[Network.POLYGON_AMOY]: 'polygon-amoy.g.alchemy.com',
		[Network.OPTIMISM_MAINNET]: 'opt-mainnet.g.alchemy.com',
		[Network.OPTIMISM_SEPOLIA]: 'opt-sepolia.g.alchemy.com',
	};

	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, _token: string, _host: string) {
		const host = AlchemyProvider.networkStringMap[network] || '';
		const token = isValid(_token) ? _token : `alchemy-${network.toLowerCase()}-token`;

		if (!host) {
			throw new Error('Network info not available.');
		}

		return `${transport}://${host}/v2/${token}`;
	}
}
