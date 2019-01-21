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
import {isNan, omit} from 'lodash';

export default class Transaction {
    /**
     * @param {String|Number}
     * @param {String|"contractCreation"}
     * @param {Number|BN|BigNumber|String|"auto"}
     * @param {Number|"auto"}
     * @param {Number|BN|BigNumber|String|"auto"}
     * @param {String|"auto"}
     * @param {Number|"auto"}
     *
     * @constructor
     */
    constructor(
        from,
        to,
        value,
        gas,
        gasPrice,
        data,
        nonce,
        error,  /* from factory */
        params  /* from factory */
    ) {
        this.error = error;
        this.params = params;

        /* Check for type and format validity */
        this.params.from = (
                isAddress(from) || Number.isInteger(from)
            )
            ? from.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2').toLowerCase()
            : undefined;

        this.params.to = isAddress(to)
            ? to.replace(/(0x)([0-9a-fA-F]{40})/gm, '0x$2').toLowerCase()
            : undefined;

        this.params.value = (
                !isNan(value) && Number.isInteger(value) && value >= 0) ||
                isBN(value) ||
                isBigNumber(value) ||
                (typeof value === 'string' && isBN(toBN(value))
            )
            ? toBN(value.toString())
            : undefined;

        this.params.gas = Number.isInteger(gas)
            ? gas
            : undefined;

        this.params.gasPrice = (
                (!isNan(gasPrice) && Number.isInteger(gasPrice) && gasPrice >= 0) ||
                isBN(gasPrice) ||
                isBigNumber(gasPrice) ||
                (typeof gasPrice === 'string' && isBN(toBN(gasPrice)))
            )
            ? toBN(gasPrice.toString())
            : undefined;

        this.params.data = isHex(data)
            ? data
            : undefined;

        this.params.nonce = Number.isInteger(nonce) && nonce > 0
            ? nonce
            : undefined;

        /* Set the default values */
        if (value === 'empty') this.value = toBN(0);

        if (gas === 'auto');
        // TODO

        if (gasPrice === 'auto');
        // this.gasPrice = web3.eth.gasPrice

        if (data === 'empty') this.params.data = '0x';

        if (nonce === 'auto');
        // default nonce

        /* Allow empty 'to' field if code is being deployed */
        if (to === 'deploy') this.params = omit(this.params, 'to');

        /* Throw if any parameter is still undefined */
        Object.keys(this.params).forEach((key) => {
            this.params[key] && this._throw(this.error[key]);
        });
    }

    _throw(message) {
        throw message;
    }

}
