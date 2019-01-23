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
import {isNaN, omit, cloneDeep} from 'lodash';

export default class Transaction {
    /**
     * @param {String|Number} from
     * @param {String|"deploy"} to
     * @param {Number|BN|BigNumber|String|"none"} value
     * @param {Number|"auto"} gas
     * @param {Number|BN|BigNumber|String|"auto"} gasPrice
     * @param {String|"none"} data
     * @param {Number|"auto"} nonce
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {
        this.error = error;
        this.initParams = initParams;
        this.params = cloneDeep(initParams);

        /* Check for type and format validity */
        this.params.from =
            isAddress(params.from) || Number.isInteger(params.from)
                ? params.from.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2').toLowerCase()
                : undefined;

        this.params.to = isAddress(params.to) ? params.to.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2').toLowerCase() : undefined;

        this.params.value =
            (!isNaN(params.value)
                && Number.isInteger(params.value) && params.value >= 0) ||
            isBN(params.value) ||
            isBigNumber(params.value) ||
            (typeof params.value === 'string'
                && /([0-9])+/gm.test(params.value)
                && isBN(toBN(params.value)))
                ? toBN(params.value.toString())
                : undefined;

        this.params.gas = Number.isInteger(params.gas) ? params.gas : undefined;

        this.params.gasPrice =
            (!isNaN(params.gasPrice)
                && Number.isInteger(params.gasPrice)
                && params.gasPrice >= 0) ||
            isBN(params.gasPrice) ||
            isBigNumber(params.gasPrice) ||
            (typeof params.gasPrice === 'string'
                && isBN(toBN(params.gasPrice)))
                ? toBN(params.gasPrice.toString())
                : undefined;

        this.params.data = isHex(params.data) ? params.data : undefined;

        this.params.nonce = params.nonce === 0 || Number.isInteger(params.nonce) ? params.nonce : undefined;

        /* Set the default values */
        if (params.value === 'none') this.params.value = toBN(0);

        if (params.gas === 'auto');
        // TODO

        if (params.gasPrice === 'auto');
        // TODO this.gasPrice = web3.eth.gasPrice

        if (params.data === 'none') this.params.data = '0x';

        if (params.nonce === 'auto');
        // TODO default nonce

        /* Allow empty 'to' field if code is being deployed */
        if (params.to === 'deploy') this.params = omit(this.params, 'to');

        /* Throw if any parameter is still undefined */
        Object.keys(this.params).forEach((key) => {
            typeof this.params[key] === 'undefined' && this._throw(this.error[key]);
        });
    }

    _throw(message) {
        throw message;
    }
}
