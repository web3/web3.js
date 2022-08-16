'use strict';
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				var desc = Object.getOwnPropertyDescriptor(m, k);
				if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
					desc = {
						enumerable: true,
						get: function () {
							return m[k];
						},
					};
				}
				Object.defineProperty(o, k2, desc);
		  }
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
		  });
var __setModuleDefault =
	(this && this.__setModuleDefault) ||
	(Object.create
		? function (o, v) {
				Object.defineProperty(o, 'default', { enumerable: true, value: v });
		  }
		: function (o, v) {
				o['default'] = v;
		  });
var __importStar =
	(this && this.__importStar) ||
	function (mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null)
			for (var k in mod)
				if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
					__createBinding(result, mod, k);
		__setModuleDefault(result, mod);
		return result;
	};
var __importDefault =
	(this && this.__importDefault) ||
	function (mod) {
		return mod && mod.__esModule ? mod : { default: mod };
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.Web3 = void 0;
const fs_1 = require('fs');
const web3_core_1 = require('web3-core');
const web3_eth_1 = __importDefault(require('web3-eth'));
const web3_eth_contract_1 = __importDefault(require('web3-eth-contract'));
const web3_eth_ens_1 = require('web3-eth-ens');
const web3_eth_iban_1 = __importDefault(require('web3-eth-iban'));
const web3_eth_personal_1 = __importDefault(require('web3-eth-personal'));
const web3_net_1 = __importDefault(require('web3-net'));
const utils = __importStar(require('web3-utils'));
const web3_utils_1 = require('web3-utils');
const abi_1 = __importDefault(require('./abi'));
const accounts_1 = require('./accounts');
const packageJson = JSON.parse((0, fs_1.readFileSync)('./package.json', 'utf8'));
class Web3 extends web3_core_1.Web3Context {
	constructor(provider) {
		super({ provider });
		const accounts = (0, accounts_1.initAccountsForContext)(this);
		this._wallet = accounts.wallet;
		this._accountProvider = accounts;
		this.utils = utils;
		const self = this;
		class ContractBuilder extends web3_eth_contract_1.default {
			constructor(jsonInterface, addressOrOptions, options) {
				if (typeof addressOrOptions === 'string') {
					super(jsonInterface, addressOrOptions, self.getContextObject());
				} else if (typeof addressOrOptions === 'object') {
					super(jsonInterface, addressOrOptions, self.getContextObject());
				} else if (
					!(0, web3_utils_1.isNullish)(addressOrOptions) &&
					(0, web3_utils_1.isNullish)(options)
				) {
					super(
						jsonInterface,
						addressOrOptions !== null && addressOrOptions !== void 0
							? addressOrOptions
							: {},
						self.getContextObject(),
					);
				} else if (
					(0, web3_utils_1.isNullish)(addressOrOptions) &&
					!(0, web3_utils_1.isNullish)(options)
				) {
					super(
						jsonInterface,
						options !== null && options !== void 0 ? options : {},
						self.getContextObject(),
					);
				} else {
					super(jsonInterface, self.getContextObject());
				}
				ContractBuilder._contracts.push(this);
			}
			static setProvider(_provider) {
				for (const contract of ContractBuilder._contracts) {
					contract.provider = _provider;
				}
				return true;
			}
		}
		ContractBuilder._contracts = [];
		const eth = self.use(web3_eth_1.default);
		this.eth = Object.assign(eth, {
			ens: self.use(web3_eth_ens_1.ENS, web3_eth_ens_1.registryAddresses.main),
			Iban: web3_eth_iban_1.default,
			net: self.use(web3_net_1.default),
			personal: self.use(web3_eth_personal_1.default),
			Contract: ContractBuilder,
			abi: abi_1.default,
			accounts,
		});
	}
}
exports.Web3 = Web3;
Web3.version = packageJson.version;
Web3.utils = utils;
Web3.modules = {
	Web3Eth: web3_eth_1.default,
	Iban: web3_eth_iban_1.default,
	Net: web3_net_1.default,
	ENS: web3_eth_ens_1.ENS,
	Personal: web3_eth_personal_1.default,
};
//# sourceMappingURL=web3.js.map
