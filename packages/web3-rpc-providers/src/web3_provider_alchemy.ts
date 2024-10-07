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
	EthExecutionAPI,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	JsonRpcResponseWithResult,
	Web3APISpec,
} from 'web3-types';
import { HttpProviderOptions } from 'web3-providers-http';
import { ResponseError } from 'web3-errors';
import { Web3ExternalProvider } from './web3_provider.js';
import { Network, Transport, SocketOptions } from './types.js';

function isValid(value: string): boolean {
	return !!(value && value.trim().length > 0);
}

export class AlchemyProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3ExternalProvider {
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		token = '',
		host = '',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, token, host, providerConfigOptions);
	}


	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, _token: string, _host: string) {
		let host = '';
		let token = '';

		switch (network) {
			case Network.ETH_MAINNET:
				host = isValid(_host) ? _host : 'eth-mainnet.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-mainnet-token';
				break;
			case Network.ETH_SEPOLIA:
				host = isValid(_host) ? _host : 'eth-sepolia.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-sepolia-token';
				break;
			case Network.ETH_GOERLI:
				host = isValid(_host) ? _host : 'eth-goerli.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-goerli-token';
				break;

			case Network.ARBITRUM_MAINNET:
				host = isValid(_host) ? _host : 'arb-mainnet.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-arbitrum-mainnet-token';
				break;
			case Network.ARBITRUM_SEPOLIA:
				host = isValid(_host) ? _host : 'arb-sepolia.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-arbitrum-sepolia-token';
				break;

			case Network.BASE_MAINNET:
				host = isValid(_host) ? _host : 'base-mainnet.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-base-mainnet-token';
				break;
			case Network.BASE_SEPOLIA:
				host = isValid(_host) ? _host : 'base-sepolia.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-base-sepolia-token';
				break;

			case Network.POLYGON_MAINNET:
				host = isValid(_host) ? _host : 'polygon-mainnet.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-polygon-mainnet-token';
				break;
			case Network.POLYGON_AMOY:
				host = isValid(_host) ? _host : 'polygon-amoy.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-polygon-amoy-token';
				break;

			case Network.OPTIMISM_MAINNET:
				host = isValid(_host) ? _host : 'opt-mainnet.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-optimism-mainnet-token';
				break;
			case Network.OPTIMISM_SEPOLIA:
				host = isValid(_host) ? _host : 'opt-sepolia.g.alchemy.com';
				token = isValid(_token) ? _token : 'alchemy-optimism-sepolia-token';
				break;
			default:
				throw new Error('Network info not available.');
		}

		return `${transport}://${host}/v2/${token}`;
	}
}
