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
/**
 * @file EthereumConfiguration.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

import JsonRpcConfiguration from "../../../core/src/json-rpc/config/JsonRpcConfiguration";
import Address from "../../lib/types/input/Address.js";
import TransactionConfiguration from "internal/ethereum/lib/config/interfaces/TransactionConfiguration";

export default class EthereumConfiguration extends JsonRpcConfiguration {
    /**
     * @property block
     */
    public block: string | number | undefined;

    /**
     * @property transaction
     */
    public transaction: TransactionConfiguration;

    /**
     * @property _account
     */
    private _account: string | undefined;

    /**
     * @param {Object} options
     * @param {Object} parent
     *
     * @constructor
     */
    public constructor(
        options: any = {},
        parent?: any
    ) {
        super(options, parent);

        this.block = options.block || parent ? parent.block : 'latest';

        const parentTransaction = parent ? parent.transaction : false;

        this.transaction = Object.assign(
            {timeout: 50, confirmations: 0},
            parentTransaction ? Object.assign(parentTransaction, options.transaction) : options.transaction
        );
        this.account = options.account;
    }

    /**
     * Getter for the defaultAccount property
     *
     * @property defaultAccount
     *
     * @returns {null|String}
     */
    public get account() {
        return this._account;
    }

    /**
     * Sets the defaultAccount of the current object
     *
     * @property defaultAccount
     *
     * @param {String} value
     */
    public set account(value) {
        if (value) {
            this._account = Address.toChecksum((value));
        }

        this._account = undefined;
    }

    /**
     * Returns a JSON compatible object
     *
     * @method toJSON
     *
     * @returns {Object}
     */
    public toJSON(): any {
        return {
            account: this.account,
            block: this.block,
            transaction: this.transaction,
            ... super.toJSON()
        }
    }
}
