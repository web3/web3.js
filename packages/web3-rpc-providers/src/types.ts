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

import { ClientOptions, ClientRequestArgs } from 'web3-providers-ws';
import { ReconnectOptions } from 'web3-utils';

export enum Transport {
	HTTPS = 'https',
	WebSocket = 'wss',
}

export enum Network {
	ETH_MAINNET = 'eth_mainnet',
	ETH_SEPOLIA = 'eth_sepolia',
	ETH_HOLESKY = 'eth_holesky',

	POLYGON_MAINNET = 'polygon_mainnet',

	POLYGON_AMOY = 'polygon_amoy',
	SUI_MAINNET = 'sui_mainnet',
	SUI_TESTNET = 'sui_testnet',
	INJECTIVE_MAINNET = 'injective_mainnet',
	INJECTIVE_TESTNET = 'injective_testnet',
	AVALANCHE_C_MAINNET = 'avalanche_c_mainnet',
	AVALANCHE_P_MAINNET = 'avalanche_p_mainnet',
	AVALANCHE_X_MAINNET = 'avalanche_x_mainnet',

	ARBITRUM_MAINNET = 'arbitrum_mainnet',
	ARBITRUM_SEPOLIA = 'arbitrum_sepolia',

	BASE_MAINNET = 'base_mainnet',
	BASE_SEPOLIA = 'base_sepolia',

	OPTIMISM_MAINNET = 'optimism_mainnet',
	OPTIMISM_SEPOLIA = 'optimism_sepolia',

	FANTOM_MAINNET = 'fantom_mainnet',
	FANTOM_TESTNET = 'fantom_testnet',

	OSMOSIS_MAINNET = 'osmosis_mainnet',
	DYMENSION_MAINNET = 'dymension_mainnet',
	DYMENSION_TESTNET = 'dymension_testnet',

	BNB_MAINNET = 'bnb_mainnet',
	BNB_TESTNET = 'bnb_testnet',

	BSC_MAINNET = 'bsc_mainnet',
	BSC_TESTNET = 'bsc_testnet',

	ARBITRUM_ONE = 'arbitrum_one',
	ARBITRUM_NOVA = 'arbitrum_nova',
	AVALANCHE_FUJI_C = 'avalanche_fuji_c',
	AVALANCHE_FUJI_P = 'avalanche_fuji_p',
	AVALANCHE_FUJI_X = 'avalanche_fuji_x',
	TERRA_CLASSIC_MAINNET = 'terra classic_mainnet',
	BLAST_MAINNET = 'blast_mainnet',
	KUJIRA_MAINNET = 'kujira_mainnet',
	OPBNB_MAINNET = 'opbnb_mainnet',
	OPBNB_TESTNET = 'opbnb_testnet',
	SEI_MAINNET = 'sei_mainnet',
	DYDX_MAINNET = 'dydx_mainnet',
	ORAICHAIN_MAINNET = 'oraichain_mainnet',
	GNOSIS_MAINNET = 'gnosis_mainnet',
	GNOSIS_CHIADO = 'gnosis_chiado',
	SOLANA_MAINNET = 'solana_mainnet',
	PULSECHAIN_MAINNET = 'pulsechain_mainnet',
	PULSECHAIN_TESTNET = 'pulsechain_testnet',
	COSMOS_MAINNET = 'cosmos_mainnet',
	KAVA_MAINNET = 'kava_mainnet',
	CRONOS_MAINNET = 'cronos_mainnet',
	MANTLE_MAINNET = 'mantle_mainnet',
	POLKADOT_MAINNET = 'polkadot_mainnet',
	TERRA_MAINNET = 'terra_mainnet',
	NEUTRON_MAINNET = 'neutron_mainnet',
	HAQQ_MAINNET = 'haqq_mainnet',
	CHILIZ_MAINNET = 'chiliz_mainnet',
	CHILIZ_SPICY = 'chiliz_spicy',
	MOONBEAM_MAINNET = 'moonbeam_mainnet',
	TAIKO_MAINNET = 'taiko_mainnet',
	TAIKO_HEKLA = 'taiko_hekla',
	EVMOS_MAINNET = 'evmos_mainnet',
	EVMOS_TESTNET = 'evmos_testnet',
	CELESTIA_MAINNET = 'celestia_mainnet',
	CELESTIA_MOCHA = 'celestia_mocha',
	BERACHAIN_TESTNET = 'berachain_testnet',
	LINEA_MAINNET = 'linea_mainnet',
	LINEA_SEPOLIA = 'linea_sepolia',
	JUNO_MAINNET = 'juno_mainnet',
	BAHAMUT_MAINNET = 'bahamut_mainnet',
	SCROLL_MAINNET = 'scroll_mainnet',
	SCROLL_SEPOLIA = 'scroll_sepolia',
	TRON_MAINNET = 'tron_mainnet',
	CRONOS_POS_CHAIN_MAINNET = 'cronos pos chain_mainnet',
	AKASH_NETWORK_MAINNET = 'akash network_mainnet',
	SYSCOIN_MAINNET = 'syscoin_mainnet',
	SYSCOIN_TANENBAUM = 'syscoin_tanenbaum',
	MOONRIVER_MAINNET = 'moonriver_mainnet',
	COREUM_MAINNET = 'coreum_mainnet',
	STRIDE_MAINNET = 'stride_mainnet',
	REGEN_MAINNET = 'regen_mainnet',
	SENTINEL_MAINNET = 'sentinel_mainnet',
	STARGAZE_MAINNET = 'stargaze_mainnet',
	ASSETMANTLE_MAINNET = 'assetmantle_mainnet',
	TENET_EVM_MAINNET = 'tenet_evm_mainnet',
	TENET_MAINNET = 'tenet_mainnet',
	CHIHUAHUA_MAINNET = 'chihuahua_mainnet',
	FETCH_AI_MAINNET = 'fetch_ai_mainnet',
	ELYS_NETWORK_TESTNET = 'elys_network_testnet',
	TERITORI_MAINNET = 'teritori_mainnet',
	NOLUS_MAINNET = 'nolus_mainnet',
	IRISNET_EVM_MAINNET = 'irisnet_evm_mainnet',
	IRISNET_MAINNET = 'irisnet_mainnet',
	QUASAR_MAINNET = 'quasar_mainnet',
	REBUS_MAINNET = 'rebus_mainnet',
	SIFCHAIN_MAINNET = 'sifchain_mainnet',
	SAGA_MAINNET = 'saga_mainnet',
	COMDEX_MAINNET = 'comdex_mainnet',
	MARS_PROTOCOL_MAINNET = 'mars_protocol_mainnet',
	PERSISTENCE_MAINNET = 'persistence_mainnet',
	QUICKSILVER_MAINNET = 'quicksilver_mainnet',
	KUSAMA_MAINNET = 'kusama_mainnet',
	MANTRA_TESTNET = 'mantra_testnet',
	NIBIRU_MAINNET = 'nibiru_mainnet',
	SHENTU_MAINNET = 'shentu_mainnet',
	BITCOIN_MAINNET = 'bitcoin_mainnet',
	BITCOIN_TESTNET = 'bitcoin_testnet',
	BITCANNA_MAINNET = 'bitcanna_mainnet',
	LAVA_NETWORK_MAINNET = 'lava_network_mainnet',
	AXELAR_MAINNET = 'axelar_mainnet',
	PASSAGE_MAINNET = 'passage_mainnet',
	RIZON_MAINNET = 'rizon_mainnet',
	XPLA_EVM_MAINNET = 'xpla_evm_mainnet',
	XPLA_MAINNET = 'xpla_mainnet',
	OMNIFLIX_NETWORK_MAINNET = 'omniflix_network_mainnet',
	MIGALOO_MAINNET = 'migaloo_mainnet',
	CELER_NETWORK_MAINNET = 'celer_network_mainnet',
	CUDOS_MAINNET = 'cudos_mainnet',
	DORA_FACTORY_MAINNET = 'dora_factory_mainnet',
	GOVGEN_MAINNET = 'govgen_mainnet',
	CHEQD_MAINNET = 'cheqd_mainnet',
	AVAIL_MAINNET = 'avail_mainnet',
	AVAIL_TURING = 'avail_turing',
	MEDIBLOC_MAINNET = 'medibloc_mainnet',
	DASH_MAINNET = 'dash_mainnet',
	PIVX_MAINNET = 'pivx_mainnet',
	FIRO_MAINNET = 'firo_mainnet',
	MANTA_ATLANTIC = 'manta_atlantic',
	CROWN_MAINNET = 'crown_mainnet',
	DEFICHAIN_MAINNET = 'defichain_mainnet',
	PAC_PROTOCOL_MAINNET = 'pac_protocol_mainnet',
	WAGERR_MAINNET = 'wagerr_mainnet',
}

// Combining the ws types
export type SocketOptions = {
	socketOptions?: ClientOptions | ClientRequestArgs;
	reconnectOptions?: Partial<ReconnectOptions>;
};
