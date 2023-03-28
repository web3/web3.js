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
import { stripHexPrefix, intToHex } from 'web3-utils';
import { isHexPrefixed } from 'web3-validator';

import { Hardfork } from './enums';

type ConfigHardfork =
	// eslint-disable-next-line @typescript-eslint/ban-types
	| { name: string; block: null; timestamp: number }
	| { name: string; block: number; timestamp?: number };
/**
 * Transforms Geth formatted nonce (i.e. hex string) to 8 byte 0x-prefixed string used internally
 * @param nonce string parsed from the Geth genesis file
 * @returns nonce as a 0x-prefixed 8 byte string
 */
function formatNonce(nonce: string): string {
	if (!nonce || nonce === '0x0') {
		return '0x0000000000000000';
	}
	if (isHexPrefixed(nonce)) {
		return `0x${stripHexPrefix(nonce).padStart(16, '0')}`;
	}
	return `0x${nonce.padStart(16, '0')}`;
}

/**
 * Converts Geth genesis parameters to an EthereumJS compatible `CommonOpts` object
 * @param json object representing the Geth genesis file
 * @param optional mergeForkIdPostMerge which clarifies the placement of MergeForkIdTransition
 * hardfork, which by default is post merge as with the merged eth networks but could also come
 * before merge like in kiln genesis
 * @returns genesis parameters in a `CommonOpts` compliant object
 */
function parseGethParams(json: any, mergeForkIdPostMerge = true) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const {
		name,
		config,
		difficulty,
		mixHash,
		gasLimit,
		coinbase,
		baseFeePerGas,
	}: {
		name: string;
		config: any;
		difficulty: string;
		mixHash: string;
		gasLimit: string;
		coinbase: string;
		baseFeePerGas: string;
	} = json;
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	let { extraData, timestamp, nonce }: { extraData: string; timestamp: string; nonce: string } =
		json;
	const genesisTimestamp = Number(timestamp);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { chainId }: { chainId: number } = config;

	// geth is not strictly putting empty fields with a 0x prefix
	if (extraData === '') {
		extraData = '0x';
	}
	// geth may use number for timestamp
	if (!isHexPrefixed(timestamp)) {
		// eslint-disable-next-line radix
		timestamp = intToHex(parseInt(timestamp));
	}
	// geth may not give us a nonce strictly formatted to an 8 byte hex string
	if (nonce.length !== 18) {
		nonce = formatNonce(nonce);
	}

	// EIP155 and EIP158 are both part of Spurious Dragon hardfork and must occur at the same time
	// but have different configuration parameters in geth genesis parameters
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (config.eip155Block !== config.eip158Block) {
		throw new Error(
			'EIP155 block number must equal EIP 158 block number since both are part of SpuriousDragon hardfork and the client only supports activating the full hardfork',
		);
	}

	const params = {
		name,
		chainId,
		networkId: chainId,
		genesis: {
			timestamp,
			// eslint-disable-next-line radix
			gasLimit: parseInt(gasLimit), // geth gasLimit and difficulty are hex strings while ours are `number`s
			// eslint-disable-next-line radix
			difficulty: parseInt(difficulty),
			nonce,
			extraData,
			mixHash,
			coinbase,
			baseFeePerGas,
		},
		hardfork: undefined as string | undefined,
		hardforks: [] as ConfigHardfork[],
		bootstrapNodes: [],
		consensus:
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			config.clique !== undefined
				? {
						type: 'poa',
						algorithm: 'clique',
						clique: {
							// The recent geth genesis seems to be using blockperiodseconds
							// and epochlength for clique specification
							// see: https://hackmd.io/PqZgMpnkSWCWv5joJoFymQ
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
							period: config.clique.period ?? config.clique.blockperiodseconds,
							// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-assignment
							epoch: config.clique.epoch ?? config.clique.epochlength,
						},
				  }
				: {
						type: 'pow',
						algorithm: 'ethash',
						ethash: {},
				  },
	};

	const forkMap: { [key: string]: { name: string; postMerge?: boolean; isTimestamp?: boolean } } =
		{
			[Hardfork.Homestead]: { name: 'homesteadBlock' },
			[Hardfork.Dao]: { name: 'daoForkBlock' },
			[Hardfork.TangerineWhistle]: { name: 'eip150Block' },
			[Hardfork.SpuriousDragon]: { name: 'eip155Block' },
			[Hardfork.Byzantium]: { name: 'byzantiumBlock' },
			[Hardfork.Constantinople]: { name: 'constantinopleBlock' },
			[Hardfork.Petersburg]: { name: 'petersburgBlock' },
			[Hardfork.Istanbul]: { name: 'istanbulBlock' },
			[Hardfork.MuirGlacier]: { name: 'muirGlacierBlock' },
			[Hardfork.Berlin]: { name: 'berlinBlock' },
			[Hardfork.London]: { name: 'londonBlock' },
			[Hardfork.MergeForkIdTransition]: {
				name: 'mergeForkBlock',
				postMerge: mergeForkIdPostMerge,
			},
			[Hardfork.Shanghai]: { name: 'shanghaiTime', postMerge: true, isTimestamp: true },
			[Hardfork.ShardingForkDev]: {
				name: 'shardingForkTime',
				postMerge: true,
				isTimestamp: true,
			},
		};

	// forkMapRev is the map from config field name to Hardfork
	const forkMapRev = Object.keys(forkMap).reduce<{ [key: string]: string }>((acc, elem) => {
		acc[forkMap[elem].name] = elem;
		return acc;
	}, {});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
	const configHardforkNames = Object.keys(config).filter(
		// eslint-disable-next-line no-null/no-null, @typescript-eslint/no-unsafe-member-access
		key => forkMapRev[key] !== undefined && config[key] !== undefined && config[key] !== null,
	);

	params.hardforks = configHardforkNames
		.map(nameBlock => ({
			name: forkMapRev[nameBlock],
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			block:
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				forkMap[forkMapRev[nameBlock]].isTimestamp === true ||
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				typeof config[nameBlock] !== 'number'
					? // eslint-disable-next-line no-null/no-null
					  null
					: // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  config[nameBlock],
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			timestamp:
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				forkMap[forkMapRev[nameBlock]].isTimestamp === true &&
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				typeof config[nameBlock] === 'number'
					? // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					  config[nameBlock]
					: undefined,
		}))
		// eslint-disable-next-line no-null/no-null
		.filter(fork => fork.block !== null || fork.timestamp !== undefined) as ConfigHardfork[];

	params.hardforks.sort(
		(a: ConfigHardfork, b: ConfigHardfork) => (a.block ?? Infinity) - (b.block ?? Infinity),
	);

	params.hardforks.sort(
		(a: ConfigHardfork, b: ConfigHardfork) =>
			(a.timestamp ?? genesisTimestamp) - (b.timestamp ?? genesisTimestamp),
	);
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	if (config.terminalTotalDifficulty !== undefined) {
		// Following points need to be considered for placement of merge hf
		// - Merge hardfork can't be placed at genesis
		// - Place merge hf before any hardforks that require CL participation for e.g. withdrawals
		// - Merge hardfork has to be placed just after genesis if any of the genesis hardforks make CL
		//   necessary for e.g. withdrawals
		const mergeConfig = {
			name: Hardfork.Merge,
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
			ttd: config.terminalTotalDifficulty,
			// eslint-disable-next-line no-null/no-null
			block: null,
		};

		// Merge hardfork has to be placed before first hardfork that is dependent on merge
		const postMergeIndex = params.hardforks.findIndex(
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			(hf: any) => forkMap[hf.name]?.postMerge === true,
		);
		if (postMergeIndex !== -1) {
			params.hardforks.splice(postMergeIndex, 0, mergeConfig as unknown as ConfigHardfork);
		} else {
			params.hardforks.push(mergeConfig as unknown as ConfigHardfork);
		}
	}

	const latestHardfork = params.hardforks.length > 0 ? params.hardforks.slice(-1)[0] : undefined;
	params.hardfork = latestHardfork?.name;
	params.hardforks.unshift({ name: Hardfork.Chainstart, block: 0 });

	return params;
}

/**
 * Parses a genesis.json exported from Geth into parameters for Common instance
 * @param json representing the Geth genesis file
 * @param name optional chain name
 * @returns parsed params
 */
export function parseGethGenesis(json: any, name?: string, mergeForkIdPostMerge?: boolean) {
	try {
		if (['config', 'difficulty', 'gasLimit', 'alloc'].some(field => !(field in json))) {
			throw new Error('Invalid format, expected geth genesis fields missing');
		}
		if (name !== undefined) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
			json.name = name;
		}
		return parseGethParams(json, mergeForkIdPostMerge);
	} catch (e: any) {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/restrict-template-expressions
		throw new Error(`Error parsing parameters file: ${e.message}`);
	}
}
