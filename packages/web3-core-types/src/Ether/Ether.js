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
 * @file Ether.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import BigNumber from 'bignumber.js';
import {cloneDeep, isObject, isString} from 'lodash';

/* Unit map from ethjs-unit */
const unitMap = {
    noether: '0',
    wei: '1',
    kwei: '1000',
    Kwei: '1000',
    babbage: '1000',
    femtoether: '1000',
    mwei: '1000000',
    Mwei: '1000000',
    lovelace: '1000000',
    picoether: '1000000',
    gwei: '1000000000',
    Gwei: '1000000000',
    shannon: '1000000000',
    nanoether: '1000000000',
    nano: '1000000000',
    szabo: '1000000000000',
    microether: '1000000000000',
    micro: '1000000000000',
    finney: '1000000000000000',
    milliether: '1000000000000000',
    milli: '1000000000000000',
    ether: '1000000000000000000',
    kether: '1000000000000000000000',
    grand: '1000000000000000000000',
    mether: '1000000000000000000000000',
    gether: '1000000000000000000000000000',
    tether: '1000000000000000000000000000000'
};

export default class Ether {
    /**
     * @dev {} parameter
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {
        /* -) params are the values given to the constructor
         * -) this.props are the params fed via the constructor
         *      after being filtered.
         * -) this.props start assigned to undefined via initParams */

        /* 1) Set the errors */
        this.error = error;

        /* 2) Set the initial values */
        this.initParams = initParams;

        /* 3) Initialize the parameters */
        this.props = cloneDeep(initParams);

        /* 4) Reshape params to emulate different constructor overrides */
        if (!isObject(params)) {
            params = {
                amount: params,
                unit: 'ether'
            };
        }

        /* 5) Check for type and format validity */
        this.props.unit =
            isString(params.unit) && Object.keys(unitMap).indexOf(params.unit.toLowerCase()) > -1
                ? params.unit.toLowerCase()
                : undefined;

        this.props.amount = /^\d+(\.\d+)?$/i.test(params.amount) ? params.amount.toString() : undefined;

        /* 7) Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });

        /* 8) Make the props immutable */
        Object.freeze(this.props);
    }

    /**
     * Parse the created unit to wei
     *
     * @method toWei
     *
     * @return {String}
     */
    toWei() {
        return BigNumber(this.props.amount)
            .times(BigNumber(unitMap[this.props.unit]))
            .toFixed();
    }

    /**
     * Parse the created unit to another unit
     *
     * @method toUnit
     *
     * @return {String}
     */
    toUnit(unit) {
        if (Object.keys(unitMap).indexOf(this.props.unit) === -1)
            throw new Error(`The given unit name ${unit} is unknown.`);

        const from = unitMap[this.props.unit];
        const to = unitMap[unit];

        return BigNumber(this.props.amount)
            .times(BigNumber(from))
            .div(BigNumber(to))
            .toFixed();
    }

    /**
     * Override toString to print the unit information
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return `${this.props.amount} ${this.props.unit}`;
    }

    /**
     * isEther
     * @dev add this as a function property to quickly check
     *      if the object is of type Ether
     */
    isEther() {
        return true;
    }

    /**
     * _throw is wrap the error throw when checking for parsing errors
     */
    _throw(message, value) {
        throw message(value);
    }
}
