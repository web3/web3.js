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
 * @file Transaction.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import {isAddress, isBN, isBigNumber, toBN, isHex} from 'web3-utils';
import {isNaN, omit} from 'lodash';

export default class Transaction {
    /**
     * @param {String|Number}
     * @param {String|"deploy"}
     * @param {Number|BN|BigNumber|String|"none"}
     * @param {Number|"auto"}
     * @param {Number|BN|BigNumber|String|"auto"}
     * @param {String|"none"}
     * @param {Number|"auto"}
     *
     * @constructor
     */
    constructor(txParams, error /* from factory */, params /* from factory */) {

        this.error = error;
        this.params = params;

        /* Check for type and format validity */
        this.params.from =
            isAddress(txParams.from) || Number.isInteger(txParams.from)
                ? txParams.from.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2').toLowerCase()
                : undefined;

        this.params.to = isAddress(txParams.to) ? txParams.to.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2').toLowerCase() : undefined;

        this.params.value =
            (!isNaN(txParams.value)
                && Number.isInteger(txParams.value) && txParams.value >= 0) ||
            isBN(txParams.value) ||
            isBigNumber(txParams.value) ||
            (typeof txParams.value === 'string'
                && /([0-9])+/gm.test(txParams.value)
                && isBN(toBN(txParams.value)))
                ? toBN(txParams.value.toString())
                : undefined;

        this.params.gas = Number.isInteger(txParams.gas) ? txParams.gas : undefined;

        this.params.gasPrice =
            (!isNaN(txParams.gasPrice)
                && Number.isInteger(txParams.gasPrice)
                && txParams.gasPrice >= 0) ||
            isBN(txParams.gasPrice) ||
            isBigNumber(txParams.gasPrice) ||
            (typeof txParams.gasPrice === 'string'
                && isBN(toBN(txParams.gasPrice)))
                ? toBN(txParams.gasPrice.toString())
                : undefined;

        this.params.data = isHex(txParams.data) ? txParams.data : undefined;

        this.params.nonce = txParams.nonce === 0 || Number.isInteger(txParams.nonce) ? txParams.nonce : undefined;

        /* Set the default values */
        if (txParams.value === 'none') this.params.value = toBN(0);

        if (txParams.gas === 'auto');
        // TODO

        if (txParams.gasPrice === 'auto');
        // this.gasPrice = web3.eth.gasPrice

        if (txParams.data === 'none') this.params.data = '0x';

        if (txParams.nonce === 'auto');
        // default nonce

        /* Allow empty 'to' field if code is being deployed */
        if (txParams.to === 'deploy') this.params = omit(this.params, 'to');

        /* Throw if any parameter is still undefined */
        Object.keys(this.params).forEach((key) => {
            typeof this.params[key] === 'undefined' && this._throw(this.error[key]);
        });
    }

    _throw(message) {
        throw message;
    }
}
