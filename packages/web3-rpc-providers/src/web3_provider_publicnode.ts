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
	// Network.INJECTIVE_MAINNET,
	// Network.INJECTIVE_TESTNET,
	// Network.OSMOSIS_MAINNET,
	// Network.SUI_MAINNET,
	// Network.TERRA_CLASSIC_MAINNET,
	// Network.KUJIRA_MAINNET,
	// Network.SEI_MAINNET,
	// Network.DYDX_MAINNET,
	// Network.ORAICHAIN_MAINNET,
	// Network.COSMOS_MAINNET,
	Network.KAVA_MAINNET,
	Network.CRONOS_MAINNET,
	// Network.TERRA_MAINNET,
	// Network.NEUTRON_MAINNET,
	// Network.HAQQ_MAINNET,
	// Network.EVMOS_MAINNET,
	// Network.EVMOS_TESTNET,
	// Network.CELESTIA_MAINNET,
	// Network.CELESTIA_MOCHA,
	// Network.BERACHAIN_TESTNET,
	// Network.JUNO_MAINNET,
	// Network.CRONOS_POS_CHAIN_MAINNET,
	// Network.AKASH_NETWORK_MAINNET,
	// Network.COREUM_MAINNET,
	// Network.STRIDE_MAINNET,
	// Network.REGEN_MAINNET,
	// Network.SENTINEL_MAINNET,
	// Network.STARGAZE_MAINNET,
	// Network.ASSETMANTLE_MAINNET,
	// Network.TENET_MAINNET,
	// Network.CHIHUAHUA_MAINNET,
	// Network.FETCH_AI_MAINNET,
	// Network.ELYS_NETWORK_TESTNET,
	// Network.TERITORI_MAINNET,
	// Network.NOLUS_MAINNET,
	// Network.IRISNET_MAINNET,
	// Network.QUASAR_MAINNET,
	// Network.REBUS_MAINNET,
	// Network.SIFCHAIN_MAINNET,
	// Network.SAGA_MAINNET,
	// Network.COMDEX_MAINNET,
	// Network.MARS_PROTOCOL_MAINNET,
	// Network.PERSISTENCE_MAINNET,
	// Network.QUICKSILVER_MAINNET,
	// Network.MANTRA_TESTNET,
	// Network.NIBIRU_MAINNET,
	// Network.SHENTU_MAINNET,
	// Network.BITCANNA_MAINNET,
	// Network.LAVA_NETWORK_MAINNET,
	// Network.AXELAR_MAINNET,
	// Network.PASSAGE_MAINNET,
	// Network.RIZON_MAINNET,
	// Network.XPLA_MAINNET,
	// Network.OMNIFLIX_NETWORK_MAINNET,
	// Network.MIGALOO_MAINNET,
	// Network.CELER_NETWORK_MAINNET,
	// Network.CUDOS_MAINNET,
	// Network.DORA_FACTORY_MAINNET,
	// Network.GOVGEN_MAINNET,
	// Network.CHEQD_MAINNET,
	// Network.MEDIBLOC_MAINNET,
	// deprecated
	Network.POLYGON_MAINNET,
	// Network.SUI_TESTNET,
];

export class PublicNodeProvider<
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
		[Network.POLYGON_AMOY]: 'polygon-amoy-bor-rpc.publicnode.com',
		// [Network.POLYGON_HEIMDALL_AMONY]: 'polygon-amoy-heimdall-rpc.publicnode.com:443',
		[Network.DYMENSION_MAINNET]: 'dymension-evm-rpc.publicnode.com',
		[Network.DYMENSION_TESTNET]: 'dymension-testnet-evm-rpc.publicnode.com',
		// [Network.INJECTIVE_MAINNET]: 'injective-rpc.publicnode.com:443',
		// [Network.INJECTIVE_TESTNET]: 'injective-testnet-rpc.publicnode.com:443',
		// [Network.OSMOSIS_MAINNET]: 'osmosis-rpc.publicnode.com:443',
		// [Network.SUI_MAINNET]: 'sui-rpc.publicnode.com',
		// [Network.TERRA_CLASSIC_MAINNET]: 'terra-classic-rpc.publicnode.com:443',
		[Network.BLAST_MAINNET]: 'blast-rpc.publicnode.com',
		// [Network.KUJIRA_MAINNET]: 'kujira-rpc.publicnode.com:443',
		// [Network.SEI_MAINNET]: 'sei-rpc.publicnode.com:443',
		// [Network.DYDX_MAINNET]: 'dydx-rpc.publicnode.com:443',
		// [Network.ORAICHAIN_MAINNET]: 'oraichain-rpc.publicnode.com:443',
		[Network.GNOSIS_MAINNET]: 'gnosis-rpc.publicnode.com',
		[Network.PULSECHAIN_MAINNET]: 'pulsechain-rpc.publicnode.com',
		[Network.PULSECHAIN_TESTNET]: 'pulsechain-testnet-rpc.publicnode.com',
		// [Network.COSMOS_MAINNET]: 'cosmos-rpc.publicnode.com:443',
		[Network.KAVA_MAINNET]: 'kava-evm-rpc.publicnode.com',
		[Network.CRONOS_MAINNET]: 'cronos-evm-rpc.publicnode.com',
		[Network.MANTLE_MAINNET]: 'mantle-rpc.publicnode.com',
		// [Network.TERRA_MAINNET]: 'terra-rpc.publicnode.com:443',
		// [Network.NEUTRON_MAINNET]: 'neutron-rpc.publicnode.com:443',
		// [Network.HAQQ_MAINNET]: 'haqq-evm-rpc.publicnode.com',
		[Network.TAIKO_MAINNET]: 'taiko-rpc.publicnode.com',
		[Network.TAIKO_HEKLA]: 'taiko-hekla-rpc.publicnode.com',
		// [Network.EVMOS_MAINNET]: 'evmos-evm-rpc.publicnode.com',
		// [Network.EVMOS_TESTNET]: 'evmos-testnet-evm-rpc.publicnode.com',
		// [Network.CELESTIA_MAINNET]: 'celestia-rpc.publicnode.com:443',
		// [Network.CELESTIA_MOCHA]: 'celestia-mocha-rpc.publicnode.com:443',
		// [Network.BERACHAIN_TESTNET]: 'berachain-testnet-evm-rpc.publicnode.com',
		[Network.LINEA_MAINNET]: 'linea-rpc.publicnode.com',
		[Network.LINEA_SEPOLIA]: 'linea-sepolia-rpc.publicnode.com',
		// [Network.JUNO_MAINNET]: 'juno-rpc.publicnode.com:443',
		[Network.SCROLL_MAINNET]: 'scroll-rpc.publicnode.com',
		[Network.SCROLL_SEPOLIA]: 'scroll-sepolia-rpc.publicnode.com',
		// [Network.CRONOS_POS_CHAIN_MAINNET]: 'cronos-pos-rpc.publicnode.com:443',
		// [Network.AKASH_NETWORK_MAINNET]: 'akash-rpc.publicnode.com:443',
		[Network.SYSCOIN_MAINNET]: 'syscoin-evm-rpc.publicnode.com',
		[Network.SYSCOIN_TANENBAUM]: 'syscoin-tanenbaum-evm-rpc.publicnode.com',
		// [Network.COREUM_MAINNET]: 'coreum-rpc.publicnode.com:443',
		// [Network.STRIDE_MAINNET]: 'stride-rpc.publicnode.com:443',
		// [Network.REGEN_MAINNET]: 'regen-rpc.publicnode.com:443',
		// [Network.SENTINEL_MAINNET]: 'sentinel-rpc.publicnode.com:443',
		// [Network.STARGAZE_MAINNET]: 'stargaze-rpc.publicnode.com:443',
		// [Network.ASSETMANTLE_MAINNET]: 'asset-mantle-rpc.publicnode.com:443',
		// [Network.TENET_EVM_MAINNET]: 'tenet-evm-rpc.publicnode.com',
		// [Network.TENET_MAINNET]: 'tenet-rpc.publicnode.com:443',
		// [Network.CHIHUAHUA_MAINNET]: 'chihuahua-rpc.publicnode.com:443',
		// [Network.FETCH_AI_MAINNET]: 'fetch-rpc.publicnode.com:443',
		// [Network.ELYS_NETWORK_TESTNET]: 'elys-testnet-rpc.publicnode.com:443',
		// [Network.TERITORI_MAINNET]: 'teritori-rpc.publicnode.com:443',
		// [Network.NOLUS_MAINNET]: 'nolus-rpc.publicnode.com:443',
		// [Network.IRISNET_EVM_MAINNET]: 'iris-evm-rpc.publicnode.com',
		// [Network.IRISNET_MAINNET]: 'iris-rpc.publicnode.com:443',
		// [Network.QUASAR_MAINNET]: 'quasar-rpc.publicnode.com:443',
		// [Network.REBUS_MAINNET]: 'rebus-rpc.publicnode.com:443',
		// [Network.SIFCHAIN_MAINNET]: 'sifchain-rpc.publicnode.com:443',
		// [Network.SAGA_MAINNET]: 'saga-rpc.publicnode.com:443',
		// [Network.COMDEX_MAINNET]: 'comdex-rpc.publicnode.com:443',
		// [Network.MARS_PROTOCOL_MAINNET]: 'mars-rpc.publicnode.com:443',
		// [Network.PERSISTENCE_MAINNET]: 'persistence-rpc.publicnode.com:443',
		// [Network.QUICKSILVER_MAINNET]: 'quicksilver-rpc.publicnode.com:443',
		// [Network.MANTRA_TESTNET]: 'mantra-testnet-rpc.publicnode.com:443',
		// [Network.NIBIRU_MAINNET]: 'nibiru-rpc.publicnode.com:443',
		// [Network.SHENTU_MAINNET]: 'shentu-rpc.publicnode.com:443',
		// [Network.BITCOIN_MAINNET]: 'bitcoin-rpc.publicnode.com',
		// [Network.BITCOIN_TESTNET]: 'bitcoin-testnet-rpc.publicnode.com',
		// [Network.BITCANNA_MAINNET]: 'bitcanna-rpc.publicnode.com:443',
		// [Network.LAVA_NETWORK_MAINNET]: 'lava-rpc.publicnode.com:443',
		// [Network.AXELAR_MAINNET]: 'axelar-rpc.publicnode.com:443',
		// [Network.PASSAGE_MAINNET]: 'passage-rpc.publicnode.com:443',
		// [Network.RIZON_MAINNET]: 'rizon-rpc.publicnode.com:443',
		// [Network.XPLA_EVM_MAINNET]: 'xpla-evm-rpc.publicnode.com',
		// [Network.XPLA_MAINNET]: 'xpla-rpc.publicnode.com:443',
		// [Network.OMNIFLIX_NETWORK_MAINNET]: 'omniflix-rpc.publicnode.com:443',
		// [Network.MIGALOO_MAINNET]: 'migaloo-rpc.publicnode.com:443',
		// [Network.CELER_NETWORK_MAINNET]: 'celer-rpc.publicnode.com:443',
		// [Network.CUDOS_MAINNET]: 'cudos-rpc.publicnode.com:443',
		// [Network.DORA_FACTORY_MAINNET]: 'dora-rpc.publicnode.com:443',
		// [Network.GOVGEN_MAINNET]: 'govgen-rpc.publicnode.com:443',
		// [Network.CHEQD_MAINNET]: 'cheqd-rpc.publicnode.com:443',
		// [Network.AVAIL_MAINNET]: 'avail-rpc.publicnode.com',
		// [Network.AVAIL_TURING]: 'avail-turing-rpc.publicnode.com',
		// [Network.MEDIBLOC_MAINNET]: 'medibloc-rpc.publicnode.com:443',
		// [Network.DASH_MAINNET]: 'dash-rpc.publicnode.com',
		// [Network.PIVX_MAINNET]: 'pivx-rpc.publicnode.com',
		// [Network.FIRO_MAINNET]: 'firo-rpc.publicnode.com',

		// [Network.MANTA_ATLANTIC]: 'manta-atlantic-rpc.publicnode.com',
		// [Network.CROWN_MAINNET]: 'crown-rpc.publicnode.com',
		// [Network.DEFICHAIN_MAINNET]: 'defichain-rpc.publicnode.com',
		// [Network.PAC_PROTOCOL_MAINNET]: 'pacprotocol-rpc.publicnode.com',
		// [Network.WAGERR_MAINNET]: 'wagerr-rpc.publicnode.com',
		//deprecated
		[Network.ETH_MAINNET]: 'ethereum-rpc.publicnode.com',
		[Network.ETH_SEPOLIA]: 'ethereum-sepolia-rpc.publicnode.com',
		[Network.ETH_HOLESKY]: 'ethereum-holesky-rpc.publicnode.com',
		[Network.BSC_MAINNET]: 'bsc-rpc.publicnode.com',
		[Network.BSC_TESTNET]: 'bsc-testnet-rpc.publicnode.com',
		[Network.POLYGON_MAINNET]: 'polygon-bor-rpc.publicnode.com',
		// [Network.POLYGON_HEIMDALL_MAINNET]: 'polygon-heimdall-rpc.publicnode.com:443',
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
		// [Network.SUI_TESTNET]: 'sui-testnet-rpc.publicnode.com',
		[Network.OPBNB_MAINNET]: 'opbnb-rpc.publicnode.com',
		[Network.OPBNB_TESTNET]: 'opbnb-testnet-rpc.publicnode.com',
		[Network.GNOSIS_CHIADO]: 'gnosis-chiado-rpc.publicnode.com',
		[Network.SOLANA_MAINNET]: 'solana-rpc.publicnode.com',
		[Network.POLKADOT_MAINNET]: 'polkadot-rpc.publicnode.com',
		[Network.CHILIZ_MAINNET]: 'chiliz-rpc.publicnode.com',
		[Network.CHILIZ_SPICY]: 'chiliz-spicy-rpc.publicnode.com',
		[Network.MOONBEAM_MAINNET]: 'moonbeam-rpc.publicnode.com',
		[Network.BAHAMUT_MAINNET]: 'bahamut-rpc.publicnode.com',
		[Network.TRON_MAINNET]: 'tron-evm-rpc.publicnode.com',
		[Network.MOONRIVER_MAINNET]: 'moonriver-rpc.publicnode.com',
		// [Network.KUSAMA_MAINNET]: 'kusama-rpc.publicnode.com',
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
