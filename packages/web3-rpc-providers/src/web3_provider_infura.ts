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
	JsonRpcResponseWithResult,
	Web3APIMethod,
	Web3APIPayload,
	Web3APIReturnType,
	Web3APISpec,
} from 'web3-types';
import { ResponseError } from 'web3-errors';
import { HttpProviderOptions } from 'web3-providers-http';
import { Network, SocketOptions, Transport } from './types.js';
import { Web3ExternalProvider } from './web3_provider.js';
import { QuickNodeRateLimitError } from './errors.js';

const isValid = (str: string) => str !== undefined && str.trim().length > 0;

export class InfuraProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3ExternalProvider {
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

	public async request<
		Method extends Web3APIMethod<API>,
		ResultType = Web3APIReturnType<API, Method>,
	>(
		payload: Web3APIPayload<EthExecutionAPI, Method>,
		requestOptions?: RequestInit,
	): Promise<JsonRpcResponseWithResult<ResultType>> {
		try {
			return await super.request(payload, requestOptions);
		} catch (error) {
			if (error instanceof ResponseError && error.statusCode === 429) {
				throw new QuickNodeRateLimitError(error);
			}
			throw error;
		}
	}

	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, token: string, _host: string) {
		let host = '';

		switch (network) {
			case Network.PALM_MAINNET:
				host = isValid(_host) ? _host : 'palm-mainnet.infura.io';
				break;
			case Network.PALM_TESTNET:
				host = isValid(_host) ? _host : 'palm-testnet.infura.io';
				break;
			case Network.BLAST_MAINNET:
				host = isValid(_host) ? _host : 'blast-mainnet.infura.io';
				break;
			case Network.BLAST_SEPOLIA:
				host = isValid(_host) ? _host : 'blast-sepolia.infura.io';
				break;
			case Network.AVALANCHE_MAINNET:
				host = isValid(_host) ? _host : 'avalanche-mainnet.infura.io';
				break;
			case Network.AVALANCHE_FUJI:
				host = isValid(_host) ? _host : 'avalanche-fuji.infura.io';
				break;
			case Network.STARKNET_MAINNET:
				host = isValid(_host) ? _host : 'starknet-mainnet.infura.io';
				break;
			case Network.STARKNET_SEPOLIA:
				host = isValid(_host) ? _host : 'starknet-sepolia.infura.io';
				break;
			case Network.ZKSYNC_MAINNET:
				host = isValid(_host) ? _host : 'zksync-mainnet.infura.io';
				break;
			case Network.ZKSYNC_SEPOLIA:
				host = isValid(_host) ? _host : 'zksync-sepolia.infura.io';
				break;
			case Network.CELO_MAINNET:
				host = isValid(_host) ? _host : 'celo-mainnet.infura.io';
				break;
			case Network.CELO_ALFAJORES:
				host = isValid(_host) ? _host : 'celo-alfajores.infura.io';
				break;
			case Network.BSC_MAINNET:
				host = isValid(_host) ? _host : 'bsc-mainnet.infura.io';
				break;
			case Network.BSC_TESTNET:
				host = isValid(_host) ? _host : 'bsc-testnet.infura.io';
				break;
			case Network.MANTLE_MAINNET:
				host = isValid(_host) ? _host : 'mantle-mainnet.infura.io';
				break;
			case Network.MANTLE_SEPOLIA:
				host = isValid(_host) ? _host : 'mantle-sepolia.infura.io';
				break;
			case Network.ETH_MAINNET:
				host = isValid(_host) ? _host : 'mainnet.infura.io';
				break;
			case Network.ETH_HOLESKY:
				host = isValid(_host) ? _host : 'holesky.infura.io';
				break;
			case Network.ETH_SEPOLIA:
				host = isValid(_host) ? _host : 'sepolia.infura.io';
				break;
			case Network.ARBITRUM_MAINNET:
				host = isValid(_host) ? _host : 'arbitrum-mainnet.infura.io';
				break;
			case Network.ARBITRUM_SEPOLIA:
				host = isValid(_host) ? _host : 'arbitrum-sepolia.infura.io';
				break;
			case Network.BASE_MAINNET:
				host = isValid(_host) ? _host : 'base-mainnet.infura.io';
				break;
			case Network.BASE_SEPOLIA:
				host = isValid(_host) ? _host : 'base-sepolia.infura.io';
				break;
			case Network.BNB_MAINNET:
				host = isValid(_host) ? _host : 'opbnb-mainnet.infura.io';
				break;
			case Network.BNB_TESTNET:
				host = isValid(_host) ? _host : 'opbnb-testnet.infura.io';
				break;
			case Network.LINEA_MAINNET:
				host = isValid(_host) ? _host : 'linea-mainnet.infura.io';
				break;
			case Network.LINEA_SEPOLIA:
				host = isValid(_host) ? _host : 'linea-sepolia.infura.io';
				break;
			case Network.POLYGON_MAINNET:
				host = isValid(_host) ? _host : 'polygon-mainnet.infura.io';
				break;
			case Network.POLYGON_AMONY:
				host = isValid(_host) ? _host : 'polygon-amoy.infura.io';
				break;
			case Network.OPTIMISM_MAINNET:
				host = isValid(_host) ? _host : 'optimism-mainnet.infura.io';
				break;
			case Network.OPTIMISM_SEPOLIA:
				host = isValid(_host) ? _host : 'optimism-sepolia.infura.io';
				break;
			default:
				throw new Error('Network info not avalible.');
		}
		return `${transport}://${host}/${
			transport === Transport.WebSocket ? 'ws/' : ''
		}v3/${token}`;
	}
}
