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

import * as Types from '..';
import {isBN, isBigNumber, toBN} from 'web3-utils';
import {isNaN, isInteger, omit, cloneDeep} from 'lodash';

export default class Transaction {
    /**
     * @dev Wrap as object
     * @param {Address} from
     * @param {Address|"deploy"} to
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
        this.props = cloneDeep(initParams);

        /* Check for type and format validity */
        // TODO Link to local wallet index
        this.props.from = params.from.isAddress ? Types.Address(params.from.props) : undefined;

        this.props.to = params.to.isAddress ? Types.Address(params.to.props) : undefined;

        // TODO Move this check to BigNumber as a constructor check
        this.props.value =
            (!isNaN(params.value) && Number.isInteger(params.value) && params.value >= 0) ||
            isBN(params.value) ||
            isBigNumber(params.value) ||
            (typeof params.value === 'string' && /(\d)+/gm.test(params.value) && isBN(toBN(params.value)))
                ? toBN(params.value.toString())
                : undefined;

        this.props.gas = Number.isInteger(params.gas) ? params.gas : undefined;

        // TODO Move this check to BigNumber as a constructor check
        this.props.gasPrice =
            (!isNaN(params.gasPrice) && Number.isInteger(params.gasPrice) && params.gasPrice >= 0) ||
            isBN(params.gasPrice) ||
            isBigNumber(params.gasPrice) ||
            (typeof params.gasPrice === 'string' && isBN(toBN(params.gasPrice)))
                ? toBN(params.gasPrice.toString())
                : undefined;

        this.props.data = params.data.isHex ? Types.Hex(params.data.props) : undefined;

        this.props.nonce = params.nonce === 0 || Number.isInteger(params.nonce) ? params.nonce : undefined;

        this.props.chainId = isInteger(params.chainId) ? params.chainId.toString() : undefined;

        /* Set the default values */
        if (params.value === 'none') this.props.value = toBN(0);

        if (params.gas === 'auto');
        // TODO

        if (params.gasPrice === 'auto');
        // TODO this.gasPrice = web3.eth.gasPrice

        if (params.data === 'none') this.props.data = Types.Hex('empty');

        if (params.nonce === 'auto');
        // TODO default nonce

        if (/main/i.test(params.chainId)) this.props.chainId = '1';

        /* Allow empty 'to' field if code is being deployed */
        if (params.to === 'deploy') this.props = omit(this.props, 'to');

        /* Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });

        /* Make the props immutable */
        Object.freeze(this.props);
    }

    get gas() {
        return this.props.gas.toString();
    }

    get gasPrice() {
        return this.props.gasPrice.toString();
    }

    get to() {
        return this.props.to.toString();
    }

    get from() {
        return this.props.from.toString();
    }

    get value() {
        return this.props.value.toString();
    }

    get data() {
        return this.props.data.toString();
    }

    get nonce() {
        return parseInt(this.props.nonce);
    }

    get chainId() {
        return this.props.chainId.toString();
    }

    /**
     * Declare the type of the object
     *
     * @method isTransaction
     *
     * @return {boolean}
     */
    isTransaction() {
        return true;
    }

    /**
     * Wrap error throwing from the constructor for types
     *
     * @method _throw
     */
    _throw(message, value) {
        throw message(value);
    }
}
