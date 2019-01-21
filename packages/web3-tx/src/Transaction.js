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
 * @file index.js
 * @author Marek Kotewicz <marek@parity.io>
 * @author Fabian Vogelsteller <fabian@frozeman.de>
 * @date 2018
 */

import {isAddress, isBN, isBigNumber, toBN, } from 'web3-utils';
import {isObject, isArray} from 'lodash';

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
        nonce
    ) {
      
        /* Set the error messages */
        this.error = {
            from:     `The 'from' parameter needs to be an address or a wallet index number.`,
            to:       `The 'to' parameter needs to be an address or 'deploy' when deploying code.`,
            value:    `The 'value' parameter needs to be zero or positive, and in number, BN, BigNumber or string format.\n` +
                      `Use 'auto' for 0 ether.`,
            gas:      ``,
            gasPrice: ``,
            data:     `The 'data' parameter needs to be hex encoded.` +
                      `Use 'auto' for no payload.`,
            nonce:    `The 'nonce' parameter needs to be an integer.` +
                      `Use 'auto' to set the RPC-calculated nonce.`
        };


        /* Initialise the params */
        this.params = {
            from: undefined,
            to: undefined,
            value: undefined,
            gas: undefined,
            gasPrice: undefined,
            data: undefined,
            nonce: undefined
        };


        /* Check for type and format validity */
        this.params.from = isAddress(from) || Number.isInteger(from)
            ? from
            : undefined;

        this.params.to = isAddress(to) 
            ? to
            : undefined;

        this.params.value =
            (
              !isNan(value) && Number.isInteger(value) && value >= 0 ||
              isBN(value) ||
              isBigNumber(value) ||
              typeof value === 'string' && isBN(toBN(value))
            )
            ? value.toString()
            : undefined;

        this.params.gas = Number.isInteger(gas)
            ? gas
            : undefined;

        this.params.gasPrice = 
            (
              !isNan(gasPrice) && Number.isInteger(gasPrice) && gasPrice >= 0 ||
              isBN(gasPrice) ||
              isBigNumber(gasPrice) ||
              typeof gasPrice === 'string' && isBN(toBN(gasPrice))
            )
            ? gasPrice
            : undefined;

        this.params.data = isHex(data)
            ? data
            : undefined;

        this.params.nonce = Number.isInteger(nonce)
            ? nonce
            : undefined;


        /* Set the default values */
        if(to === 'deploy');

        if(value === 'auto')
            this.value = toBN(0);

        if(gas === 'auto');
            // TODO

        if(gasPrice === 'auto');
            // this.gasPrice = web3.eth.gasPrice

        if(data === 'none')
            this.params.data = "0x";

        if(nonce === 'auto');
            // default nonce


        /* Throw if any parameter is still undefined */
        Object.keys(this.params).forEach((key) => {
            this.params[key] && _throw(this.error[key]);
        });
    }

    _throw(message) {
        throw message;
    }

}
