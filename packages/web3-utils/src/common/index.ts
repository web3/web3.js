import { EventEmitter } from 'events';
import { buf as crc32Buffer } from 'crc-32';
import { BN, BNLike, toType, TypeOutput, intToBuffer } from 'ethereumjs-util';
import { _getInitializedChains } from './chains';
import { hardforks as HARDFORK_CHANGES } from './hardforks';
import { EIPs } from './eips';
import {
	BootstrapNode,
	Chain as IChain,
	GenesisBlock,
	GenesisState,
	Hardfork as HardforkParams,
} from './types';

export enum CustomChain {
	/**
	 * Polygon (Matic) Mainnet
	 *
	 * - [Documentation](https://docs.matic.network/docs/develop/network-details/network)
	 */
	PolygonMainnet = 'polygon-mainnet',

	/**
	 * Polygon (Matic) Mumbai Testnet
	 *
	 * - [Documentation](https://docs.matic.network/docs/develop/network-details/network)
	 */
	PolygonMumbai = 'polygon-mumbai',

	/**
	 * Arbitrum Rinkeby Testnet
	 *
	 * - [Documentation](https://developer.offchainlabs.com/docs/public_testnet)
	 */
	ArbitrumRinkebyTestnet = 'arbitrum-rinkeby-testnet',

	/**
	 * xDai EVM sidechain with a native stable token
	 *
	 * - [Documentation](https://www.xdaichain.com/)
	 */
	xDaiChain = 'x-dai-chain',

	/**
	 * Optimistic Kovan - testnet for Optimism roll-up
	 *
	 * - [Documentation](https://community.optimism.io/docs/developers/tutorials.html)
	 */
	OptimisticKovan = 'optimistic-kovan',

	/**
	 * Optimistic Ethereum - mainnet for Optimism roll-up
	 *
	 * - [Documentation](https://community.optimism.io/docs/developers/tutorials.html)
	 */
	OptimisticEthereum = 'optimistic-ethereum',
}

export enum Chain {
	Mainnet = 1,
	Ropsten = 3,
	Rinkeby = 4,
	Kovan = 42,
	Goerli = 5,
	Sepolia = 11155111,
}

export enum Hardfork {
	Chainstart = 'chainstart',
	Homestead = 'homestead',
	Dao = 'dao',
	TangerineWhistle = 'tangerineWhistle',
	SpuriousDragon = 'spuriousDragon',
	Byzantium = 'byzantium',
	Constantinople = 'constantinople',
	Petersburg = 'petersburg',
	Istanbul = 'istanbul',
	MuirGlacier = 'muirGlacier',
	Berlin = 'berlin',
	London = 'london',
	ArrowGlacier = 'arrowGlacier',
	GrayGlacier = 'grayGlacier',
	MergeForkIdTransition = 'mergeForkIdTransition',
	Merge = 'merge',
	Shanghai = 'shanghai',
}

export enum ConsensusType {
	ProofOfStake = 'pos',
	ProofOfWork = 'pow',
	ProofOfAuthority = 'poa',
}

export enum ConsensusAlgorithm {
	Ethash = 'ethash',
	Clique = 'clique',
	Casper = 'casper',
}

interface BaseOpts {
	/**
	 * String identifier ('byzantium') for hardfork or {@link Hardfork} enum.
	 *
	 * Default: Hardfork.Istanbul
	 */
	hardfork?: string | Hardfork;
	/**
	 * Limit parameter returns to the given hardforks
	 */
	supportedHardforks?: Array<string | Hardfork>;
	/**
	 * Selected EIPs which can be activated, please use an array for instantiation
	 * (e.g. `eips: [ 2537, ]`)
	 *
	 * Currently supported:
	 *
	 * - [EIP-2537](https://eips.ethereum.org/EIPS/eip-2537) - BLS12-381 precompiles
	 */
	eips?: number[];
}

/**
 * Options for instantiating a {@link Common} instance.
 */
export interface CommonOpts extends BaseOpts {
	/**
	 * Chain name ('mainnet'), id (1), or {@link Chain} enum,
	 * either from a chain directly supported or a custom chain
	 * passed in via {@link CommonOpts.customChains}.
	 */
	chain: string | number | Chain | BN | object;
	/**
	 * Initialize (in addition to the supported chains) with the selected
	 * custom chains
	 *
	 * Usage (directly with the respective chain intialization via the {@link CommonOpts.chain} option):
	 *
	 * Pattern 1 (without genesis state):
	 *
	 * ```javascript
	 * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
	 * const common = new Common({ chain: 'myCustomChain1', customChains: [ myCustomChain1 ]})
	 * ```
	 *
	 * Pattern 2 (with genesis state see {@link GenesisState} for format):
	 *
	 * ```javascript
	 * const simpleState = {
	 *   '0x0...01': '0x100', // For EoA
	 * }
	 * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
	 * import chain1GenesisState from '[PATH_TO_GENESIS_STATES]/chain1GenesisState.json'
	 * const common = new Common({ chain: 'myCustomChain1', customChains: [ [ myCustomChain1, simpleState ] ]})
	 * ```
	 *
	 * Pattern 3 (with complex genesis state, containing contract accounts and storage).
	 * Note that in {@link AccountState} there are two
	 * accepted types. This allows to easily insert accounts in the genesis state:
	 *
	 * A complex genesis state with Contract and EoA states would have the following format:
	 *
	 * ```javascript
	 * const complexState = {
	 *   '0x0...01': '0x100', // For EoA
	 *   '0x0...02': ['0x1', '0xRUNTIME_BYTECODE', [[ keyOne, valueOne ], [ keyTwo, valueTwo ]]] // For contracts
	 * }
	 * import myCustomChain1 from '[PATH_TO_MY_CHAINS]/myCustomChain1.json'
	 * const common = new Common({ chain: 'myCustomChain1', customChains: [ [ myCustomChain1, complexState ] ]})
	 * ```
	 */
	customChains?: IChain[] | [IChain, GenesisState][];
}

/**
 * Options to be used with the {@link Common.custom} static constructor.
 */
export interface CustomCommonOpts extends BaseOpts {
	/**
	 * The name (`mainnet`), id (`1`), or {@link Chain} enum of
	 * a standard chain used to base the custom chain params on.
	 */
	baseChain?: string | number | Chain | BN;
}

interface hardforkOptions {
	/** optional, only allow supported HFs (default: false) */
	onlySupported?: boolean;
	/** optional, only active HFs (default: false) */
	onlyActive?: boolean;
}

/**
 * Common class to access chain and hardfork parameters and to provide
 * a unified and shared view on the network and hardfork state.
 *
 * Use the {@link Common.custom} static constructor for creating simple
 * custom chain {@link Common} objects (more complete custom chain setups
 * can be created via the main constructor and the {@link CommonOpts.customChains} parameter).
 */
export default class Common extends EventEmitter {
	readonly DEFAULT_HARDFORK: string | Hardfork;

	private _chainParams: IChain;
	private _hardfork: string | Hardfork;
	private _supportedHardforks: Array<string | Hardfork> = [];
	private _eips: number[] = [];
	private _customChains: IChain[] | [IChain, GenesisState][];

	/**
	 * Creates a {@link Common} object for a custom chain, based on a standard one.
	 *
	 * It uses all the {@link Chain} parameters from the {@link baseChain} option except the ones overridden
	 * in a provided {@link chainParamsOrName} dictionary. Some usage example:
	 *
	 * ```javascript
	 * Common.custom({chainId: 123})
	 * ```
	 *
	 * There are also selected supported custom chains which can be initialized by using one of the
	 * {@link CustomChains} for {@link chainParamsOrName}, e.g.:
	 *
	 * ```javascript
	 * Common.custom(CustomChains.MaticMumbai)
	 * ```
	 *
	 * Note that these supported custom chains only provide some base parameters (usually the chain and
	 * network ID and a name) and can only be used for selected use cases (e.g. sending a tx with
	 * the `@ethereumjs/tx` library to a Layer-2 chain).
	 *
	 * @param chainParamsOrName Custom parameter dict (`name` will default to `custom-chain`) or string with name of a supported custom chain
	 * @param opts Custom chain options to set the {@link CustomCommonOpts.baseChain}, selected {@link CustomCommonOpts.hardfork} and others
	 */
	static custom(
		chainParamsOrName: Partial<IChain> | CustomChain,
		opts: CustomCommonOpts = {},
	): Common {
		const baseChain = opts.baseChain ?? 'mainnet';
		const standardChainParams = { ...Common._getChainParams(baseChain) };
		standardChainParams['name'] = 'custom-chain';

		if (typeof chainParamsOrName !== 'string') {
			return new Common({
				chain: {
					...standardChainParams,
					...chainParamsOrName,
				},
				...opts,
			});
		} else {
			if (chainParamsOrName === CustomChain.PolygonMainnet) {
				return Common.custom(
					{
						name: CustomChain.PolygonMainnet,
						chainId: 137,
						networkId: 137,
					},
					opts,
				);
			}
			if (chainParamsOrName === CustomChain.PolygonMumbai) {
				return Common.custom(
					{
						name: CustomChain.PolygonMumbai,
						chainId: 80001,
						networkId: 80001,
					},
					opts,
				);
			}
			if (chainParamsOrName === CustomChain.ArbitrumRinkebyTestnet) {
				return Common.custom(
					{
						name: CustomChain.ArbitrumRinkebyTestnet,
						chainId: 421611,
						networkId: 421611,
					},
					opts,
				);
			}
			if (chainParamsOrName === CustomChain.xDaiChain) {
				return Common.custom(
					{
						name: CustomChain.xDaiChain,
						chainId: 100,
						networkId: 100,
					},
					opts,
				);
			}

			if (chainParamsOrName === CustomChain.OptimisticKovan) {
				return Common.custom(
					{
						name: CustomChain.OptimisticKovan,
						chainId: 69,
						networkId: 69,
					},
					// Optimism has not implemented the London hardfork yet (targeting Q1.22)
					{ hardfork: Hardfork.Berlin, ...opts },
				);
			}

			if (chainParamsOrName === CustomChain.OptimisticEthereum) {
				return Common.custom(
					{
						name: CustomChain.OptimisticEthereum,
						chainId: 10,
						networkId: 10,
					},
					// Optimism has not implemented the London hardfork yet (targeting Q1.22)
					{ hardfork: Hardfork.Berlin, ...opts },
				);
			}
			throw new Error(`Custom chain ${chainParamsOrName} not supported`);
		}
	}

	/**
	 * Creates a {@link Common} object for a custom chain, based on a standard one. It uses all the `Chain`
	 * params from {@link baseChain} except the ones overridden in {@link customChainParams}.
	 *
	 * @deprecated Use {@link Common.custom} instead
	 *
	 * @param baseChain The name (`mainnet`) or id (`1`) of a standard chain used to base the custom
	 * chain params on.
	 * @param customChainParams The custom parameters of the chain.
	 * @param hardfork String identifier ('byzantium') for hardfork (optional)
	 * @param supportedHardforks Limit parameter returns to the given hardforks (optional)
	 */
	static forCustomChain(
		baseChain: string | number | Chain,
		customChainParams: Partial<IChain>,
		hardfork?: string | Hardfork,
		supportedHardforks?: Array<string | Hardfork>,
	): Common {
		const standardChainParams = Common._getChainParams(baseChain);

		return new Common({
			chain: {
				...standardChainParams,
				...customChainParams,
			},
			hardfork: hardfork,
			supportedHardforks: supportedHardforks,
		});
	}

	/**
	 * Static method to determine if a {@link chainId} is supported as a standard chain
	 * @param chainId BN id (`1`) of a standard chain
	 * @returns boolean
	 */
	static isSupportedChainId(chainId: BN): boolean {
		const initializedChains: any = _getInitializedChains();
		return Boolean(initializedChains['names'][chainId.toString()]);
	}

	private static _getChainParams(
		chain: string | number | Chain | BN,
		customChains?: IChain[],
	): IChain {
		const initializedChains: any = _getInitializedChains(customChains);
		if (typeof chain === 'number' || BN.isBN(chain)) {
			chain = chain.toString();

			if (initializedChains['names'][chain]) {
				const name: string = initializedChains['names'][chain];
				return initializedChains[name];
			}

			throw new Error(`Chain with ID ${chain} not supported`);
		}

		if (initializedChains[chain]) {
			return initializedChains[chain];
		}

		throw new Error(`Chain with name ${chain} not supported`);
	}

	/**
	 *
	 * @constructor
	 */
	constructor(opts: CommonOpts) {
		super();
		this._customChains = opts.customChains ?? [];
		this._chainParams = this.setChain(opts.chain);
		this.DEFAULT_HARDFORK = this._chainParams.defaultHardfork ?? Hardfork.Istanbul;
		for (const hf of this._chainParams.hardforks) {
			if (!hf.forkHash) {
				hf.forkHash = this._calcForkHash(hf.name);
			}
		}
		this._hardfork = this.DEFAULT_HARDFORK;
		if (opts.supportedHardforks) {
			this._supportedHardforks = opts.supportedHardforks;
		}
		if (opts.hardfork) {
			this.setHardfork(opts.hardfork);
		}
		if (opts.eips) {
			this.setEIPs(opts.eips);
		}
	}

	/**
	 * Sets the chain
	 * @param chain String ('mainnet') or Number (1) chain
	 *     representation. Or, a Dictionary of chain parameters for a private network.
	 * @returns The dictionary with parameters set as chain
	 */
	setChain(chain: string | number | Chain | BN | object): any {
		if (typeof chain === 'number' || typeof chain === 'string' || BN.isBN(chain)) {
			// Filter out genesis states if passed in to customChains
			let plainCustomChains: IChain[];
			if (
				this._customChains &&
				this._customChains.length > 0 &&
				Array.isArray(this._customChains[0])
			) {
				plainCustomChains = (this._customChains as [IChain, GenesisState][]).map(e => e[0]);
			} else {
				plainCustomChains = this._customChains as IChain[];
			}
			this._chainParams = Common._getChainParams(chain, plainCustomChains);
		} else if (typeof chain === 'object') {
			if (this._customChains.length > 0) {
				throw new Error(
					'Chain must be a string, number, or BN when initialized with customChains passed in',
				);
			}
			const required = ['networkId', 'genesis', 'hardforks', 'bootstrapNodes'];
			for (const param of required) {
				if ((<any>chain)[param] === undefined) {
					throw new Error(`Missing required chain parameter: ${param}`);
				}
			}
			this._chainParams = chain as IChain;
		} else {
			throw new Error('Wrong input format');
		}
		return this._chainParams;
	}

	/**
	 * Sets the hardfork to get params for
	 * @param hardfork String identifier (e.g. 'byzantium') or {@link Hardfork} enum
	 */
	setHardfork(hardfork: string | Hardfork): void {
		if (!this._isSupportedHardfork(hardfork)) {
			throw new Error(`Hardfork ${hardfork} not set as supported in supportedHardforks`);
		}
		let existing = false;
		for (const hfChanges of HARDFORK_CHANGES) {
			if (hfChanges[0] === hardfork) {
				if (this._hardfork !== hardfork) {
					this._hardfork = hardfork;
					this.emit('hardforkChanged', hardfork);
				}
				existing = true;
			}
		}
		if (!existing) {
			throw new Error(`Hardfork with name ${hardfork} not supported`);
		}
	}

	/**
	 * Returns the hardfork based on the block number or an optional
	 * total difficulty (Merge HF) provided.
	 *
	 * An optional TD takes precedence in case the corresponding HF block
	 * is set to `null` or otherwise needs to match (if not an error
	 * will be thrown).
	 *
	 * @param blockNumber
	 * @param td
	 * @returns The name of the HF
	 */
	getHardforkByBlockNumber(blockNumber: BNLike, td?: BNLike): string {
		blockNumber = toType(blockNumber, TypeOutput.BN);
		td = toType(td, TypeOutput.BN);

		let hardfork = Hardfork.Chainstart;
		let minTdHF;
		let maxTdHF;
		let previousHF;
		for (const hf of this.hardforks()) {
			// Skip comparison for not applied HFs
			if (hf.block === null) {
				if (td !== undefined && td !== null && hf.td !== undefined && hf.td !== null) {
					if (td.gte(new BN(hf.td))) {
						return hf.name;
					}
				}
				continue;
			}
			if (blockNumber.gte(new BN(hf.block))) {
				hardfork = hf.name as Hardfork;
			}
			if (td && hf.td) {
				if (td.gte(new BN(hf.td))) {
					minTdHF = hf.name;
				} else {
					maxTdHF = previousHF;
				}
			}
			previousHF = hf.name;
		}
		if (td) {
			let msgAdd = `block number: ${blockNumber} (-> ${hardfork}), `;
			if (minTdHF) {
				if (!this.hardforkGteHardfork(hardfork, minTdHF)) {
					const msg =
						'HF determined by block number is lower than the minimum total difficulty HF';
					msgAdd += `total difficulty: ${td} (-> ${minTdHF})`;
					throw new Error(`${msg}: ${msgAdd}`);
				}
			}
			if (maxTdHF) {
				if (!this.hardforkGteHardfork(maxTdHF, hardfork)) {
					const msg =
						'Maximum HF determined by total difficulty is lower than the block number HF';
					msgAdd += `total difficulty: ${td} (-> ${maxTdHF})`;
					throw new Error(`${msg}: ${msgAdd}`);
				}
			}
		}
		return hardfork;
	}

	/**
	 * Sets a new hardfork based on the block number or an optional
	 * total difficulty (Merge HF) provided.
	 *
	 * An optional TD takes precedence in case the corresponding HF block
	 * is set to `null` or otherwise needs to match (if not an error
	 * will be thrown).
	 *
	 * @param blockNumber
	 * @param td
	 * @returns The name of the HF set
	 */
	setHardforkByBlockNumber(blockNumber: BNLike, td?: BNLike): string {
		const hardfork = this.getHardforkByBlockNumber(blockNumber, td);
		this.setHardfork(hardfork);
		return hardfork;
	}

	/**
	 * Internal helper function to choose between hardfork set and hardfork provided as param
	 * @param hardfork Hardfork given to function as a parameter
	 * @returns Hardfork chosen to be used
	 */
	_chooseHardfork(hardfork?: string | Hardfork | null, onlySupported: boolean = true): string {
		if (!hardfork) {
			hardfork = this._hardfork;
		} else if (onlySupported && !this._isSupportedHardfork(hardfork)) {
			throw new Error(`Hardfork ${hardfork} not set as supported in supportedHardforks`);
		}
		return hardfork;
	}

	/**
	 * Internal helper function, returns the params for the given hardfork for the chain set
	 * @param hardfork Hardfork name
	 * @returns Dictionary with hardfork params
	 */
	_getHardfork(hardfork: string | Hardfork): any {
		const hfs = this.hardforks();
		for (const hf of hfs) {
			if (hf['name'] === hardfork) return hf;
		}
		throw new Error(`Hardfork ${hardfork} not defined for chain ${this.chainName()}`);
	}

	/**
	 * Internal helper function to check if a hardfork is set to be supported by the library
	 * @param hardfork Hardfork name
	 * @returns True if hardfork is supported
	 */
	_isSupportedHardfork(hardfork: string | Hardfork | null): boolean {
		if (this._supportedHardforks.length > 0) {
			for (const supportedHf of this._supportedHardforks) {
				if (hardfork === supportedHf) return true;
			}
		} else {
			return true;
		}
		return false;
	}

	/**
	 * Sets the active EIPs
	 * @param eips
	 */
	setEIPs(eips: number[] = []) {
		for (const eip of eips) {
			if (!(eip in EIPs)) {
				throw new Error(`${eip} not supported`);
			}
			const minHF = this.gteHardfork(EIPs[eip]['minimumHardfork']);
			if (!minHF) {
				throw new Error(
					`${eip} cannot be activated on hardfork ${this.hardfork()}, minimumHardfork: ${minHF}`,
				);
			}
			if (EIPs[eip].requiredEIPs) {
				(EIPs[eip].requiredEIPs as number[]).forEach(elem => {
					if (!(eips.includes(elem) || this.isActivatedEIP(elem))) {
						throw new Error(
							`${eip} requires EIP ${elem}, but is not included in the EIP list`,
						);
					}
				});
			}
		}
		this._eips = eips;
	}

	/**
	 * Returns a parameter for the current chain setup
	 *
	 * If the parameter is present in an EIP, the EIP always takes precendence.
	 * Otherwise the parameter if taken from the latest applied HF with
	 * a change on the respective parameter.
	 *
	 * @param topic Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')
	 * @param name Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)
	 * @returns The value requested or `null` if not found
	 */
	param(topic: string, name: string): any {
		// TODO: consider the case that different active EIPs
		// can change the same parameter
		let value = null;
		for (const eip of this._eips) {
			value = this.paramByEIP(topic, name, eip);
			if (value !== null) {
				return value;
			}
		}
		return this.paramByHardfork(topic, name, this._hardfork);
	}

	/**
	 * Returns the parameter corresponding to a hardfork
	 * @param topic Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')
	 * @param name Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)
	 * @param hardfork Hardfork name
	 * @returns The value requested or `null` if not found
	 */
	paramByHardfork(topic: string, name: string, hardfork: string | Hardfork): any {
		hardfork = this._chooseHardfork(hardfork);

		let value = null;
		for (const hfChanges of HARDFORK_CHANGES) {
			// EIP-referencing HF file (e.g. berlin.json)
			if ('eips' in hfChanges[1]) {
				// @ts-ignore
				const hfEIPs = hfChanges[1]['eips'];
				for (const eip of hfEIPs) {
					const valueEIP = this.paramByEIP(topic, name, eip);
					value = valueEIP !== null ? valueEIP : value;
				}
				// Paramater-inlining HF file (e.g. istanbul.json)
			} else {
				// @ts-ignore
				if (!hfChanges[1][topic]) {
					throw new Error(`Topic ${topic} not defined`);
				}
				// @ts-ignore
				if (hfChanges[1][topic][name] !== undefined) {
					// @ts-ignore
					value = hfChanges[1][topic][name].v;
				}
			}
			if (hfChanges[0] === hardfork) break;
		}
		return value;
	}

	/**
	 * Returns a parameter corresponding to an EIP
	 * @param topic Parameter topic ('gasConfig', 'gasPrices', 'vm', 'pow')
	 * @param name Parameter name (e.g. 'minGasLimit' for 'gasConfig' topic)
	 * @param eip Number of the EIP
	 * @returns The value requested or `null` if not found
	 */
	paramByEIP(topic: string, name: string, eip: number): any {
		if (!(eip in EIPs)) {
			throw new Error(`${eip} not supported`);
		}

		const eipParams = EIPs[eip];
		if (!(topic in eipParams)) {
			throw new Error(`Topic ${topic} not defined`);
		}
		if (eipParams[topic][name] === undefined) {
			return null;
		}
		const value = eipParams[topic][name].v;
		return value;
	}

	/**
	 * Returns a parameter for the hardfork active on block number
	 * @param topic Parameter topic
	 * @param name Parameter name
	 * @param blockNumber Block number
	 */
	paramByBlock(topic: string, name: string, blockNumber: BNLike): any {
		const activeHfs = this.activeHardforks(blockNumber);
		const hardfork = activeHfs[activeHfs.length - 1]['name'];
		return this.paramByHardfork(topic, name, hardfork);
	}

	/**
	 * Checks if an EIP is activated by either being included in the EIPs
	 * manually passed in with the {@link CommonOpts.eips} or in a
	 * hardfork currently being active
	 *
	 * Note: this method only works for EIPs being supported
	 * by the {@link CommonOpts.eips} constructor option
	 * @param eip
	 */
	isActivatedEIP(eip: number): boolean {
		if (this.eips().includes(eip)) {
			return true;
		}
		for (const hfChanges of HARDFORK_CHANGES) {
			const hf = hfChanges[1];
			if (this.gteHardfork(hf['name']) && 'eips' in hf) {
				// @ts-ignore
				if (hf['eips'].includes(eip)) {
					return true;
				}
			}
		}
		return false;
	}

	/**
	 * Checks if set or provided hardfork is active on block number
	 * @param hardfork Hardfork name or null (for HF set)
	 * @param blockNumber
	 * @param opts Hardfork options (onlyActive unused)
	 * @returns True if HF is active on block number
	 */
	hardforkIsActiveOnBlock(
		hardfork: string | Hardfork | null,
		blockNumber: BNLike,
		opts: hardforkOptions = {},
	): boolean {
		blockNumber = toType(blockNumber, TypeOutput.BN);
		const onlySupported = opts.onlySupported ?? false;
		hardfork = this._chooseHardfork(hardfork, onlySupported);
		const hfBlock = this.hardforkBlockBN(hardfork);
		if (hfBlock && blockNumber.gte(hfBlock)) {
			return true;
		}
		return false;
	}

	/**
	 * Alias to hardforkIsActiveOnBlock when hardfork is set
	 * @param blockNumber
	 * @param opts Hardfork options (onlyActive unused)
	 * @returns True if HF is active on block number
	 */
	activeOnBlock(blockNumber: BNLike, opts?: hardforkOptions): boolean {
		return this.hardforkIsActiveOnBlock(null, blockNumber, opts);
	}

	/**
	 * Sequence based check if given or set HF1 is greater than or equal HF2
	 * @param hardfork1 Hardfork name or null (if set)
	 * @param hardfork2 Hardfork name
	 * @param opts Hardfork options
	 * @returns True if HF1 gte HF2
	 */
	hardforkGteHardfork(
		hardfork1: string | Hardfork | null,
		hardfork2: string | Hardfork,
		opts: hardforkOptions = {},
	): boolean {
		const onlyActive = opts.onlyActive === undefined ? false : opts.onlyActive;
		hardfork1 = this._chooseHardfork(hardfork1, opts.onlySupported);

		let hardforks;
		if (onlyActive) {
			hardforks = this.activeHardforks(null, opts);
		} else {
			hardforks = this.hardforks();
		}

		let posHf1 = -1,
			posHf2 = -1;
		let index = 0;
		for (const hf of hardforks) {
			if (hf['name'] === hardfork1) posHf1 = index;
			if (hf['name'] === hardfork2) posHf2 = index;
			index += 1;
		}
		return posHf1 >= posHf2 && posHf2 !== -1;
	}

	/**
	 * Alias to hardforkGteHardfork when hardfork is set
	 * @param hardfork Hardfork name
	 * @param opts Hardfork options
	 * @returns True if hardfork set is greater than hardfork provided
	 */
	gteHardfork(hardfork: string | Hardfork, opts?: hardforkOptions): boolean {
		return this.hardforkGteHardfork(null, hardfork, opts);
	}

	/**
	 * Checks if given or set hardfork is active on the chain
	 * @param hardfork Hardfork name, optional if HF set
	 * @param opts Hardfork options (onlyActive unused)
	 * @returns True if hardfork is active on the chain
	 */
	hardforkIsActiveOnChain(
		hardfork?: string | Hardfork | null,
		opts: hardforkOptions = {},
	): boolean {
		const onlySupported = opts.onlySupported ?? false;
		hardfork = this._chooseHardfork(hardfork, onlySupported);
		for (const hf of this.hardforks()) {
			if (hf['name'] === hardfork && hf['block'] !== null) return true;
		}
		return false;
	}

	/**
	 * Returns the active hardfork switches for the current chain
	 * @param blockNumber up to block if provided, otherwise for the whole chain
	 * @param opts Hardfork options (onlyActive unused)
	 * @return Array with hardfork arrays
	 */
	activeHardforks(blockNumber?: BNLike | null, opts: hardforkOptions = {}): HardforkParams[] {
		const activeHardforks: HardforkParams[] = [];
		const hfs = this.hardforks();
		for (const hf of hfs) {
			if (hf['block'] === null) continue;
			if (blockNumber !== undefined && blockNumber !== null && blockNumber < hf['block'])
				break;
			if (opts.onlySupported && !this._isSupportedHardfork(hf['name'])) continue;

			activeHardforks.push(hf);
		}
		return activeHardforks;
	}

	/**
	 * Returns the latest active hardfork name for chain or block or throws if unavailable
	 * @param blockNumber up to block if provided, otherwise for the whole chain
	 * @param opts Hardfork options (onlyActive unused)
	 * @return Hardfork name
	 */
	activeHardfork(blockNumber?: BNLike | null, opts: hardforkOptions = {}): string {
		const activeHardforks = this.activeHardforks(blockNumber, opts);
		if (activeHardforks.length > 0) {
			return activeHardforks[activeHardforks.length - 1]['name'];
		} else {
			throw new Error(`No (supported) active hardfork found`);
		}
	}

	/**
	 * Returns the hardfork change block for hardfork provided or set
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns Block number or null if unscheduled
	 * @deprecated Please use {@link Common.hardforkBlockBN} for large number support
	 */
	hardforkBlock(hardfork?: string | Hardfork): number | null {
		const block = this.hardforkBlockBN(hardfork);
		return toType(block, TypeOutput.Number);
	}

	/**
	 * Returns the hardfork change block for hardfork provided or set
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns Block number or null if unscheduled
	 */
	hardforkBlockBN(hardfork?: string | Hardfork): BN | null {
		hardfork = this._chooseHardfork(hardfork, false);
		const block = this._getHardfork(hardfork)['block'];
		if (block === undefined || block === null) {
			return null;
		}
		return new BN(block);
	}

	/**
	 * Returns the hardfork change total difficulty (Merge HF) for hardfork provided or set
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns Total difficulty or null if no set
	 */
	hardforkTD(hardfork?: string | Hardfork): BN | null {
		hardfork = this._chooseHardfork(hardfork, false);
		const td = this._getHardfork(hardfork)['td'];
		if (td === undefined || td === null) {
			return null;
		}
		return new BN(td);
	}

	/**
	 * True if block number provided is the hardfork (given or set) change block
	 * @param blockNumber Number of the block to check
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns True if blockNumber is HF block
	 */
	isHardforkBlock(blockNumber: BNLike, hardfork?: string | Hardfork): boolean {
		blockNumber = toType(blockNumber, TypeOutput.BN);
		hardfork = this._chooseHardfork(hardfork, false);
		const block = this.hardforkBlockBN(hardfork);
		return block ? block.eq(blockNumber) : false;
	}

	/**
	 * Returns the change block for the next hardfork after the hardfork provided or set
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns Block number or null if not available
	 * @deprecated Please use {@link Common.nextHardforkBlockBN} for large number support
	 */
	nextHardforkBlock(hardfork?: string | Hardfork): number | null {
		const block = this.nextHardforkBlockBN(hardfork);
		return toType(block, TypeOutput.Number);
	}

	/**
	 * Returns the change block for the next hardfork after the hardfork provided or set
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns Block number or null if not available
	 */
	nextHardforkBlockBN(hardfork?: string | Hardfork): BN | null {
		hardfork = this._chooseHardfork(hardfork, false);
		const hfBlock = this.hardforkBlockBN(hardfork);
		if (hfBlock === null) {
			return null;
		}
		// Next fork block number or null if none available
		// Logic: if accumulator is still null and on the first occurrence of
		// a block greater than the current hfBlock set the accumulator,
		// pass on the accumulator as the final result from this time on
		const nextHfBlock = this.hardforks().reduce((acc: BN | null, hf: HardforkParams) => {
			const block = new BN(hf.block!);
			return block.gt(hfBlock) && acc === null ? block : acc;
		}, null);
		return nextHfBlock;
	}

	/**
	 * True if block number provided is the hardfork change block following the hardfork given or set
	 * @param blockNumber Number of the block to check
	 * @param hardfork Hardfork name, optional if HF set
	 * @returns True if blockNumber is HF block
	 */
	isNextHardforkBlock(blockNumber: BNLike, hardfork?: string | Hardfork): boolean {
		blockNumber = toType(blockNumber, TypeOutput.BN);
		hardfork = this._chooseHardfork(hardfork, false);
		const nextHardforkBlock = this.nextHardforkBlockBN(hardfork);

		return nextHardforkBlock === null ? false : nextHardforkBlock.eq(blockNumber);
	}

	/**
	 * Internal helper function to calculate a fork hash
	 * @param hardfork Hardfork name
	 * @returns Fork hash as hex string
	 */
	_calcForkHash(hardfork: string | Hardfork) {
		const genesis = Buffer.from(this.genesis().hash.substr(2), 'hex');

		let hfBuffer = Buffer.alloc(0);
		let prevBlock = 0;
		for (const hf of this.hardforks()) {
			const block = hf.block;

			// Skip for chainstart (0), not applied HFs (null) and
			// when already applied on same block number HFs
			if (block !== 0 && block !== null && block !== prevBlock) {
				const hfBlockBuffer = Buffer.from(block.toString(16).padStart(16, '0'), 'hex');
				hfBuffer = Buffer.concat([hfBuffer, hfBlockBuffer]);
			}

			if (hf.name === hardfork) break;
			if (block !== null) {
				prevBlock = block;
			}
		}
		const inputBuffer = Buffer.concat([genesis, hfBuffer]);

		// CRC32 delivers result as signed (negative) 32-bit integer,
		// convert to hex string
		const forkhash = intToBuffer(crc32Buffer(inputBuffer) >>> 0).toString('hex');
		return `0x${forkhash}`;
	}

	/**
	 * Returns an eth/64 compliant fork hash (EIP-2124)
	 * @param hardfork Hardfork name, optional if HF set
	 */
	forkHash(hardfork?: string | Hardfork) {
		hardfork = this._chooseHardfork(hardfork, false);
		const data = this._getHardfork(hardfork);
		if (data['block'] === null && data['td'] === undefined) {
			const msg = 'No fork hash calculation possible for future hardfork';
			throw new Error(msg);
		}
		if (data['forkHash'] !== undefined) {
			return data['forkHash'];
		}
		return this._calcForkHash(hardfork);
	}

	/**
	 *
	 * @param forkHash Fork hash as a hex string
	 * @returns Array with hardfork data (name, block, forkHash)
	 */
	hardforkForForkHash(forkHash: string): any | null {
		const resArray = this.hardforks().filter((hf: any) => {
			return hf.forkHash === forkHash;
		});
		return resArray.length >= 1 ? resArray[resArray.length - 1] : null;
	}

	/**
	 * Returns the Genesis parameters of the current chain
	 * @returns Genesis dictionary
	 */
	genesis(): GenesisBlock {
		return this._chainParams['genesis'];
	}

	/**
	 * Returns the Genesis state of the current chain,
	 * all values are provided as hex-prefixed strings.
	 */
	genesisState(): GenesisState {
		// Use require statements here in favor of import statements
		// to load json files on demand
		// (high memory usage by large mainnet.json genesis state file)
		switch (this.chainName()) {
			case 'mainnet':
				return require('./genesisStates/mainnet.json');
			case 'ropsten':
				return require('./genesisStates/ropsten.json');
			case 'rinkeby':
				return require('./genesisStates/rinkeby.json');
			case 'kovan':
				return require('./genesisStates/kovan.json');
			case 'goerli':
				return require('./genesisStates/goerli.json');
			case 'sepolia':
				return require('./genesisStates/sepolia.json');
		}

		// Custom chains with genesis state provided
		if (
			this._customChains &&
			this._customChains.length > 0 &&
			Array.isArray(this._customChains[0])
		) {
			for (const chainArrayWithGenesis of this._customChains as [IChain, GenesisState][]) {
				if (chainArrayWithGenesis[0].name === this.chainName()) {
					return chainArrayWithGenesis[1];
				}
			}
		}

		return {};
	}

	/**
	 * Returns the hardforks for current chain
	 * @returns {Array} Array with arrays of hardforks
	 */
	hardforks(): HardforkParams[] {
		return this._chainParams['hardforks'];
	}

	/**
	 * Returns bootstrap nodes for the current chain
	 * @returns {Dictionary} Dict with bootstrap nodes
	 */
	bootstrapNodes(): BootstrapNode[] {
		return this._chainParams['bootstrapNodes'];
	}

	/**
	 * Returns DNS networks for the current chain
	 * @returns {String[]} Array of DNS ENR urls
	 */
	dnsNetworks(): string[] {
		return this._chainParams['dnsNetworks']!;
	}

	/**
	 * Returns the hardfork set
	 * @returns Hardfork name
	 */
	hardfork(): string | Hardfork {
		return this._hardfork;
	}

	/**
	 * Returns the Id of current chain
	 * @returns chain Id
	 * @deprecated Please use {@link Common.chainIdBN} for large number support
	 */
	chainId(): number {
		return toType(this.chainIdBN(), TypeOutput.Number);
	}

	/**
	 * Returns the Id of current chain
	 * @returns chain Id
	 */
	chainIdBN(): BN {
		return new BN(this._chainParams['chainId']);
	}

	/**
	 * Returns the name of current chain
	 * @returns chain name (lower case)
	 */
	chainName(): string {
		return this._chainParams['name'];
	}

	/**
	 * Returns the Id of current network
	 * @returns network Id
	 * @deprecated Please use {@link Common.networkIdBN} for large number support
	 */
	networkId(): number {
		return toType(this.networkIdBN(), TypeOutput.Number);
	}

	/**
	 * Returns the Id of current network
	 * @returns network Id
	 */
	networkIdBN(): BN {
		return new BN(this._chainParams['networkId']);
	}

	/**
	 * Returns the active EIPs
	 * @returns List of EIPs
	 */
	eips(): number[] {
		return this._eips;
	}

	/**
	 * Returns the consensus type of the network
	 * Possible values: "pow"|"poa"|"pos"
	 *
	 * Note: This value can update along a hardfork.
	 */
	consensusType(): string | ConsensusType {
		const hardfork = this.hardfork();

		let value;
		for (const hfChanges of HARDFORK_CHANGES) {
			if ('consensus' in hfChanges[1]) {
				// @ts-ignore
				value = hfChanges[1]['consensus']['type'];
			}
			if (hfChanges[0] === hardfork) break;
		}
		if (value) {
			return value;
		}
		return this._chainParams['consensus']!['type'];
	}

	/**
	 * Returns the concrete consensus implementation
	 * algorithm or protocol for the network
	 * e.g. "ethash" for "pow" consensus type,
	 * "clique" for "poa" consensus type or
	 * "casper" for "pos" consensus type.
	 *
	 * Note: This value can update along a hardfork.
	 */
	consensusAlgorithm(): string | ConsensusAlgorithm {
		const hardfork = this.hardfork();

		let value;
		for (const hfChanges of HARDFORK_CHANGES) {
			if ('consensus' in hfChanges[1]) {
				// @ts-ignore
				value = hfChanges[1]['consensus']['algorithm'];
			}
			if (hfChanges[0] === hardfork) break;
		}
		if (value) {
			return value;
		}
		return this._chainParams['consensus']!['algorithm'] as ConsensusAlgorithm;
	}

	/**
	 * Returns a dictionary with consensus configuration
	 * parameters based on the consensus algorithm
	 *
	 * Expected returns (parameters must be present in
	 * the respective chain json files):
	 *
	 * ethash: -
	 * clique: period, epoch
	 * aura: -
	 * casper: -
	 *
	 * Note: This value can update along a hardfork.
	 */
	consensusConfig(): { [key: string]: any } {
		const hardfork = this.hardfork();

		let value;
		for (const hfChanges of HARDFORK_CHANGES) {
			if ('consensus' in hfChanges[1]) {
				// The config parameter is named after the respective consensus algorithm
				// @ts-ignore
				value = hfChanges[1]['consensus'][hfChanges[1]['consensus']['algorithm']];
			}
			if (hfChanges[0] === hardfork) break;
		}
		if (value) {
			return value;
		}
		const consensusAlgorithm = this.consensusAlgorithm();
		return this._chainParams['consensus']![consensusAlgorithm as ConsensusAlgorithm];
	}

	/**
	 * Returns a deep copy of this {@link Common} instance.
	 */
	copy(): Common {
		const copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
		copy.removeAllListeners();
		return copy;
	}
}
