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
	mainnet,
	Network,
	QuickNodeProvider,
	Transport,
	PublicNodeProvider,
} from 'web3-rpc-providers';
import { Web3 } from '../../src/index';

type SpecialMethod = (web3: Web3) => Promise<bigint>;
type SpecialMethods = { [key: string]: SpecialMethod };

const runRpcMethod = async (web3: Web3, method: string) =>
	web3.requestManager.send({
		method,
	});

const specialMethods: SpecialMethods = {
	[Network.POLKADOT_MAINNET]: async (web3: Web3) => {
		const res = await runRpcMethod(web3, 'chain_getBlock');
		return web3.utils.toBigInt(res.block.header.number);
	},
	[Network.SOLANA_MAINNET]: async (web3: Web3) => {
		const res = await runRpcMethod(web3, 'getBlockHeight');
		return web3.utils.toBigInt(res);
	},
};

describe('Web3 RPC Provider Integration tests', () => {
	const transports = Object.values(Transport);
	const networks = [
		Network.ETH_MAINNET,
		Network.ETH_HOLESKY,
		Network.ETH_SEPOLIA,
		Network.ARBITRUM_MAINNET,
		Network.ARBITRUM_SEPOLIA,
		Network.BNB_MAINNET,
		Network.BNB_TESTNET,
		Network.POLYGON_MAINNET,
		Network.POLYGON_AMOY,
	];

	transports.forEach(transport => {
		networks.forEach(network => {
			it(`QuickNodeProvider should work with ${transport} transport and ${network} network`, async () => {
				const provider = new QuickNodeProvider(network, transport);
				const web3 = new Web3(provider);
				const result = await web3.eth.getBlockNumber();

				expect(typeof result).toBe('bigint');
				expect(result > 0).toBe(true);

				if (transport === Transport.WebSocket) {
					web3.provider?.disconnect();
				}
			});
		});
	});

	const publicNodeNetworks = [
		//-  Network.COREUM_MAINNET,
		//- Network.STRIDE_MAINNET,
		//- Network.REGEN_MAINNET,
		//- Network.SENTINEL_MAINNET,
		//- Network.STARGAZE_MAINNET,
		//- Network.ASSETMANTLE_MAINNET,
		//- Network.TENET_EVM_MAINNET,
		//- Network.TENET_MAINNET,
		//- Network.CHIHUAHUA_MAINNET,
		//- Network.FETCH_AI_MAINNET,
		//- Network.ELYS_NETWORK_TESTNET,
		//- Network.TERITORI_MAINNET,
		//- Network.NOLUS_MAINNET,
		//- Network.IRISNET_EVM_MAINNET,
		//- Network.IRISNET_MAINNET,
		//- Network.QUASAR_MAINNET,
		//- Network.REBUS_MAINNET,
		//- Network.SIFCHAIN_MAINNET,
		//- Network.SAGA_MAINNET,
		//- Network.COMDEX_MAINNET,
		//- Network.MARS_PROTOCOL_MAINNET,
		//- Network.PERSISTENCE_MAINNET,
		//- Network.QUICKSILVER_MAINNET,
		//- Network.MANTRA_TESTNET,
		//- Network.NIBIRU_MAINNET,
		//- Network.SHENTU_MAINNET,
		//- Network.BITCOIN_MAINNET,
		//- Network.BITCOIN_TESTNET,
		//- Network.BITCANNA_MAINNET,
		//- Network.LAVA_NETWORK_MAINNET,
		//- Network.AXELAR_MAINNET,
		//- Network.PASSAGE_MAINNET,
		//- Network.RIZON_MAINNET,
		//- Network.XPLA_EVM_MAINNET,
		//- Network.XPLA_MAINNET,
		//- Network.OMNIFLIX_NETWORK_MAINNET,
		//- Network.MIGALOO_MAINNET,
		//- Network.CELER_NETWORK_MAINNET,
		//- Network.CUDOS_MAINNET,
		//- Network.DORA_FACTORY_MAINNET,
		//- Network.GOVGEN_MAINNET,
		//- Network.CHEQD_MAINNET,
		//- Network.AVAIL_MAINNET,
		//- Network.AVAIL_TURING,
		//- Network.MEDIBLOC_MAINNET,
		//- Network.DASH_MAINNET,
		//- Network.PIVX_MAINNET,
		//- Network.FIRO_MAINNET,
		//- Network.MANTA_ATLANTIC, - endpoint not working
		// - Network.CROWN_MAINNET,
		//- Network.DEFICHAIN_MAINNET,
		//- Network.PAC_PROTOCOL_MAINNET,
		//- Network.WAGERR_MAINNET,
		//- Network.SUI_TESTNET,
		//- Network.KUSAMA_MAINNET,
		//- Network.INJECTIVE_MAINNET,
		//- Network.INJECTIVE_TESTNET,
		//- Network.OSMOSIS_MAINNET,
		//- Network.SUI_MAINNET,
		//- Network.TERRA_CLASSIC_MAINNET,
		//- Network.KUJIRA_MAINNET,
		//- Network.SEI_MAINNET,
		//- Network.DYDX_MAINNET,
		//- Network.ORAICHAIN_MAINNET,
		//- Network.COSMOS_MAINNET,
		//- Network.TERRA_MAINNET,
		//- Network.NEUTRON_MAINNET,
		//- Network.HAQQ_MAINNET,
		//- Network.EVMOS_MAINNET,
		//- Network.EVMOS_TESTNET,
		//- Network.CELESTIA_MAINNET,
		//- Network.CELESTIA_MOCHA,
		//- Network.BERACHAIN_TESTNET,
		//- Network.JUNO_MAINNET,
		//- Network.CRONOS_POS_CHAIN_MAINNET,
		//- Network.AKASH_NETWORK_MAINNET,
		// Network.POLYGON_AMOY,
		// Network.POLYGON_MAINNET,
		// Network.DYMENSION_MAINNET,
		// Network.DYMENSION_TESTNET,
		// Network.BLAST_MAINNET,
		// Network.GNOSIS_MAINNET,
		// Network.PULSECHAIN_MAINNET,
		// Network.PULSECHAIN_TESTNET,
		// Network.KAVA_MAINNET,
		// Network.CRONOS_MAINNET,
		// Network.MANTLE_MAINNET,
		// Network.HAQQ_MAINNET,
		// Network.TAIKO_MAINNET,
		// Network.TAIKO_HEKLA,
		// Network.EVMOS_MAINNET,
		// Network.EVMOS_TESTNET,
		// Network.BERACHAIN_TESTNET,
		// Network.LINEA_MAINNET,
		// Network.LINEA_SEPOLIA,
		// Network.SCROLL_MAINNET,
		// Network.SCROLL_SEPOLIA,
		// Network.SYSCOIN_MAINNET,
		// Network.SYSCOIN_TANENBAUM,
		// Network.ETH_MAINNET,
		// Network.ETH_SEPOLIA,
		// Network.ETH_HOLESKY,
		// Network.BSC_MAINNET,
		// Network.BSC_TESTNET,
		// Network.BASE_MAINNET,
		// Network.BASE_SEPOLIA,
		// Network.ARBITRUM_ONE,
		// Network.ARBITRUM_NOVA,
		// Network.ARBITRUM_SEPOLIA,
		// Network.AVALANCHE_C_MAINNET,
		// Network.AVALANCHE_P_MAINNET,
		// Network.AVALANCHE_X_MAINNET,
		// Network.AVALANCHE_FUJI_C,
		// Network.AVALANCHE_FUJI_P,
		// Network.AVALANCHE_FUJI_X,
		// Network.OPTIMISM_MAINNET,
		// Network.OPTIMISM_SEPOLIA,
		// Network.FANTOM_MAINNET,
		// Network.FANTOM_TESTNET,
		// Network.OPBNB_MAINNET,
		// Network.OPBNB_TESTNET,
		// Network.GNOSIS_CHIADO,
		// Network.SOLANA_MAINNET,
		// Network.POLKADOT_MAINNET,
		// Network.CHILIZ_MAINNET,
		// Network.CHILIZ_SPICY,
		// Network.MOONBEAM_MAINNET,
		// Network.BAHAMUT_MAINNET,
		// Network.TRON_MAINNET,
		// Network.MOONRIVER_MAINNET,
	];
	// transports.forEach(transport => {
	[Transport.HTTPS].forEach(transport => {
		publicNodeNetworks.forEach(network => {
			it.only(`PublicNodeProvider should work with ${transport} transport and ${network} network`, async () => {
				const provider = new PublicNodeProvider(network, transport);
				const web3 = new Web3(provider);

				const specialMethod = specialMethods[network];

				const result = await (specialMethod
					? specialMethod(web3)
					: web3.eth.getBlockNumber());

				expect(typeof result).toBe('bigint');
				expect(result > 0).toBe(true);

				if (transport === Transport.WebSocket) {
					web3.provider?.disconnect();
				}
			});
		});
	});

	it(`should work with mainnet provider`, async () => {
		const web3 = new Web3(mainnet);
		const result = await web3.eth.getBlockNumber();
		expect(typeof result).toBe('bigint');
		expect(result > 0).toBe(true);
	});

	it(`should work with default provider`, async () => {
		const web3 = new Web3();
		const result = await web3.eth.getBlockNumber();
		expect(typeof result).toBe('bigint');
		expect(result > 0).toBe(true);
	});
});
