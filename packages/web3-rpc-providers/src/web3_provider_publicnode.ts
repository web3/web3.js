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

const websocketExclusions = [
	Network.DYMENSION_MAINNET,
	Network.DYMENSION_TESTNET,
	Network.KAVA_MAINNET,
	Network.CRONOS_MAINNET,
	// deprecated
	Network.POLYGON_MAINNET,
];

export class PublicNodeProvider<
	API extends Web3APISpec = EthExecutionAPI,
> extends Web3ExternalProvider<API> {
	// eslint-disable-next-line default-param-last
	public constructor(
		network: Network = Network.ETH_MAINNET,
		transport: Transport = Transport.HTTPS,
		host = '',
		providerConfigOptions?: HttpProviderOptions | SocketOptions,
	) {
		super(network, transport, '', host, providerConfigOptions);
	}
	public static readonly networkHostMap: { [key: string]: string } = {
		[Network.POLYGON_AMOY]: 'polygon-amoy-bor-rpc.publicnode.com',
		[Network.DYMENSION_MAINNET]: 'dymension-evm-rpc.publicnode.com',
		[Network.DYMENSION_TESTNET]: 'dymension-testnet-evm-rpc.publicnode.com',
		[Network.BLAST_MAINNET]: 'blast-rpc.publicnode.com',
		[Network.GNOSIS_MAINNET]: 'gnosis-rpc.publicnode.com',
		[Network.PULSECHAIN_MAINNET]: 'pulsechain-rpc.publicnode.com',
		[Network.PULSECHAIN_TESTNET]: 'pulsechain-testnet-rpc.publicnode.com',
		[Network.KAVA_MAINNET]: 'kava-evm-rpc.publicnode.com',
		[Network.CRONOS_MAINNET]: 'cronos-evm-rpc.publicnode.com',
		[Network.MANTLE_MAINNET]: 'mantle-rpc.publicnode.com',
		[Network.TAIKO_MAINNET]: 'taiko-rpc.publicnode.com',
		[Network.TAIKO_HEKLA]: 'taiko-hekla-rpc.publicnode.com',
		[Network.LINEA_MAINNET]: 'linea-rpc.publicnode.com',
		[Network.LINEA_SEPOLIA]: 'linea-sepolia-rpc.publicnode.com',
		[Network.SCROLL_MAINNET]: 'scroll-rpc.publicnode.com',
		[Network.SCROLL_SEPOLIA]: 'scroll-sepolia-rpc.publicnode.com',
		[Network.SYSCOIN_MAINNET]: 'syscoin-evm-rpc.publicnode.com',
		[Network.SYSCOIN_TANENBAUM]: 'syscoin-tanenbaum-evm-rpc.publicnode.com',
		[Network.HAQQ_MAINNET]: 'haqq-evm-rpc.publicnode.com',
		[Network.EVMOS_MAINNET]: 'evmos-evm-rpc.publicnode.com',
		[Network.EVMOS_TESTNET]: 'evmos-testnet-evm-rpc.publicnode.com',
		[Network.BERACHAIN_TESTNET]: 'berachain-testnet-evm-rpc.publicnode.com',
		[Network.ETH_MAINNET]: 'ethereum-rpc.publicnode.com',
		[Network.ETH_SEPOLIA]: 'ethereum-sepolia-rpc.publicnode.com',
		[Network.ETH_HOLESKY]: 'ethereum-holesky-rpc.publicnode.com',
		[Network.BSC_MAINNET]: 'bsc-rpc.publicnode.com',
		[Network.BSC_TESTNET]: 'bsc-testnet-rpc.publicnode.com',
		[Network.POLYGON_MAINNET]: 'polygon-bor-rpc.publicnode.com',
		[Network.BASE_MAINNET]: 'base-rpc.publicnode.com',
		[Network.BASE_SEPOLIA]: 'base-sepolia-rpc.publicnode.com',
		[Network.ARBITRUM_ONE]: 'arbitrum-one-rpc.publicnode.com',
		[Network.ARBITRUM_NOVA]: 'arbitrum-nova-rpc.publicnode.com',
		[Network.ARBITRUM_SEPOLIA]: 'arbitrum-sepolia-rpc.publicnode.com',
		[Network.AVALANCHE_C_MAINNET]: 'avalanche-c-chain-rpc.publicnode.com',
		[Network.AVALANCHE_P_MAINNET]: 'avalanche-p-chain-rpc.publicnode.com',
		[Network.AVALANCHE_X_MAINNET]: 'avalanche-x-chain-rpc.publicnode.com',
		[Network.AVALANCHE_FUJI_C]: 'avalanche-fuji-c-chain-rpc.publicnode.com',
		[Network.AVALANCHE_FUJI_P]: 'avalanche-fuji-p-chain-rpc.publicnode.com',
		[Network.AVALANCHE_FUJI_X]: 'avalanche-fuji-x-chain-rpc.publicnode.com',
		[Network.OPTIMISM_MAINNET]: 'optimism-rpc.publicnode.com',
		[Network.OPTIMISM_SEPOLIA]: 'optimism-sepolia-rpc.publicnode.com',
		[Network.FANTOM_MAINNET]: 'fantom-rpc.publicnode.com',
		[Network.FANTOM_TESTNET]: 'fantom-testnet-rpc.publicnode.com',
		[Network.OPBNB_MAINNET]: 'opbnb-rpc.publicnode.com',
		[Network.OPBNB_TESTNET]: 'opbnb-testnet-rpc.publicnode.com',
		[Network.GNOSIS_CHIADO]: 'gnosis-chiado-rpc.publicnode.com',
		[Network.CHILIZ_MAINNET]: 'chiliz-rpc.publicnode.com',
		[Network.CHILIZ_SPICY]: 'chiliz-spicy-rpc.publicnode.com',
		[Network.MOONBEAM_MAINNET]: 'moonbeam-rpc.publicnode.com',
		[Network.BAHAMUT_MAINNET]: 'bahamut-rpc.publicnode.com',
		[Network.TRON_MAINNET]: 'tron-evm-rpc.publicnode.com',
		[Network.MOONRIVER_MAINNET]: 'moonriver-rpc.publicnode.com',
	};
	// eslint-disable-next-line class-methods-use-this
	public getRPCURL(network: Network, transport: Transport, _: string, _host: string) {
		const defaultHost = PublicNodeProvider.networkHostMap[network];
		if (!defaultHost) {
			throw new Error('Network info not avalible.');
		}
		const host = isValid(_host) ? _host : defaultHost;
		if (websocketExclusions.includes(network) && transport === Transport.WebSocket) {
			return `${transport}://${host}/websocket`;
		}
		return `${transport}://${host}`;
	}
}
