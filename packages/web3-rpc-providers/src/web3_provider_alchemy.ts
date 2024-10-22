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
		[Network.ETH_HOLESKY]: 'eth-holesky.g.alchemy.com',
		[Network.ARBITRUM_MAINNET]: 'arb-mainnet.g.alchemy.com',
		[Network.ARBITRUM_SEPOLIA]: 'arb-sepolia.g.alchemy.com',
		[Network.ARBITRUM_NOVA_MAINNET]: 'arb-nova.g.alchemy.com',
		[Network.BASE_MAINNET]: 'base-mainnet.g.alchemy.com',
		[Network.BASE_SEPOLIA]: 'base-sepolia.g.alchemy.com',
		[Network.POLYGON_MAINNET]: 'polygon-mainnet.g.alchemy.com',
		[Network.POLYGON_MUMBAI]: 'polygon-mumbai.g.alchemy.com',
		[Network.POLYGON_AMOY]: 'polygon-amoy.g.alchemy.com',
		[Network.POLYGON_POS_MAINNET]: 'polygon-mainnet.g.alchemy.com',
		[Network.POLYGON_ZKEVM_MAINNET]: 'polygonzkevm-mainnet.g.alchemy.com',
		[Network.POLYGON_ZKEVM_CARDONA]: 'polygonzkevm-cardona.g.alchemy.com',
		[Network.OPTIMISM_MAINNET]: 'opt-mainnet.g.alchemy.com',
		[Network.OPTIMISM_SEPOLIA]: 'opt-sepolia.g.alchemy.com',
		[Network.ASTAR_MAINNET]: 'astar-mainnet.g.alchemy.com',
		[Network.WORLD_CHAIN_MAINNET]: 'worldchain-mainnet.g.alchemy.com',
		[Network.WORLD_CHAIN_SEPOLIA]: 'worldchain-sepolia.g.alchemy.com',
		[Network.SHAPE_MAINNET]: 'shape-mainnet.g.alchemy.com',
		[Network.SHAPE_SEPOLIA]: 'shape-sepolia.g.alchemy.com',
		[Network.ZKSYNC_MAINNET]: 'zksync-mainnet.g.alchemy.com',
		[Network.ZKSYNC_SEPOLIA]: 'zksync-sepolia.g.alchemy.com',
		[Network.STARKNET_MAINNET]: 'starknet-mainnet.g.alchemy.com',
		[Network.STARKNET_SEPOLIA]: 'starknet-sepolia.g.alchemy.com',
		[Network.ZETACHAIN_MAINNET]: 'zetachain-mainnet.g.alchemy.com',
		[Network.ZETACHAIN_TESTNET]: 'zetachain-testnet.g.alchemy.com',
		[Network.FANTOM_OPERA_MAINNET]: 'fantom-mainnet.g.alchemy.com',
		[Network.FANTOM_OPERA_TESTNET]: 'fantom-testnet.g.alchemy.com',
		[Network.MANTLE_MAINNET]: 'mantle-mainnet.g.alchemy.com',
		[Network.BERACHAIN_ARTIO]: 'berachain-artio.g.alchemy.com',
		[Network.BLAST_MAINNET]: 'blast-mainnet.g.alchemy.com',
		[Network.BLAST_SEPOLIA]: 'blast-sepolia.g.alchemy.com',
		[Network.LINEA_MAINNET]: 'linea-mainnet.g.alchemy.com',
		[Network.LINEA_SEPOLIA]: 'linea-sepolia.g.alchemy.com',
		[Network.ZORA_MAINNET]: 'zora-mainnet.g.alchemy.com',
		[Network.ZORA_SEPOLIA]: 'zora-sepolia.g.alchemy.com',
		[Network.POLYNOMIAL_MAINNET]: 'polynomial-mainnet.g.alchemy.com',
		[Network.POLYNOMIAL_SEPOLIA]: 'polynomial-sepolia.g.alchemy.com',
		[Network.SCROLL_MAINNET]: 'scroll-mainnet.g.alchemy.com',
		[Network.SCROLL_SEPOLIA]: 'scroll-sepolia.g.alchemy.com',
		[Network.FRAX_MAINNET]: 'frax-mainnet.g.alchemy.com',
		[Network.FRAX_SEPOLIA]: 'frax-sepolia.g.alchemy.com',
		[Network.SOLANA_MAINNET]: 'solana-mainnet.g.alchemy.com',
		[Network.SOLANA_DEVNET]: 'solana-devnet.g.alchemy.com',
		[Network.CROSSFI_TESTNET]: 'crossfi-testnet.g.alchemy.com',
		[Network.FLOW_EVM_TESTNET]: 'flow-testnet.g.alchemy.com',
		[Network.SONEIUM_MINATO]: 'soneium-minato.g.alchemy.com',
		[Network.GEIST_POLTER]: 'geist-polter.g.alchemy.com',
		[Network.ROOTSTOCK_MAINNET]: 'rootstock-mainnet.g.alchemy.com',
		[Network.ROOTSTOCK_TESTNET]: 'rootstock-testnet.g.alchemy.com',
		[Network.UNICHAIN_SEPOLIA]: 'unichain-sepolia.g.alchemy.com',
		[Network.GNOSIS_MAINNET]: 'gnosis-mainnet.g.alchemy.com',
		[Network.BNB_MAINNET]: 'bnb-mainnet.g.alchemy.com',
		[Network.BNB_TESTNET]: 'bnb-testnet.g.alchemy.com',
		[Network.OPBNB_MAINNET]: 'opbnb-mainnet.g.alchemy.com',
		[Network.OPBNB_TESTNET]: 'opbnb-testnet.g.alchemy.com',
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
