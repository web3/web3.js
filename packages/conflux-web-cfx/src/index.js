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

import {formatters} from 'conflux-web-core-helpers';
import {Accounts} from 'conflux-web-cfx-accounts';
import {ContractModuleFactory} from 'conflux-web-cfx-contract';
import {AbiCoder} from 'conflux-web-cfx-abi';
import {Network} from 'conflux-web-net';
import * as Utils from 'conflux-web-utils';
import CfxTransactionSigner from './signers/TransactionSigner';
import MethodFactory from './factories/MethodFactory';
import SubscriptionsFactory from './factories/SubscriptionsFactory';
import {ProviderResolver} from 'conflux-web-providers';
import CfxModule from './Cfx.js';


/**
 * Creates the TransactionSigner class
 *
 * @returns {TransactionSigner}
 * @constructor
 */
export function TransactionSigner() {
    return new CfxTransactionSigner(Utils, formatters);
}

/**
 * Creates the Cfx object
 *
 * @method Cfx
 *
 * @param {AbstractSocketProvider|HttpProvider|CustomProvider|String} provider
 * @param {Net} net
 * @param {Object} options
 *
 * @returns {Cfx}
 * @constructor
 */
export function Cfx(provider, net = null, options = {}) {
    if (!options.transactionSigner || options.transactionSigner.type === 'TransactionSigner') {
        options.transactionSigner = new TransactionSigner();
    }

    const resolvedProvider = new ProviderResolver().resolve(provider, net);
    const accounts = new Accounts(resolvedProvider, null, options);
    const abiCoder = new AbiCoder();

    return new CfxModule(
        resolvedProvider,
        new MethodFactory(Utils, formatters),
        new Network(resolvedProvider, null, options),
        accounts,
        abiCoder,
        Utils,
        formatters,
        new SubscriptionsFactory(Utils, formatters),
        new ContractModuleFactory(Utils, formatters, abiCoder, accounts),
        options,
        net
    );
}
