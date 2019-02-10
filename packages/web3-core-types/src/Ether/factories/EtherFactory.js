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
 * @file EtherFactory.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import Ether from '../Ether';

export default class EtherFactory {
    /**
     * Returns an object of type Ether
     *
     * @method createEther
     *
     * @returns {Ether}
     */
    createEther(params) {
        /* Set the error messages */

        /**
         * These functions should contain the error messages that explain
         * why an object creation failed.
         */
        const error = {
            amount: (value) => `The amount parameter ${value} needs to be ...`,
            unit: (value) => `Explanation of why parameter ${value} was rejected`
        };

        /* Initialise the params */
        /* All the params should be defaulted to
         * undefined. If by the end of the constructor execution
         * a parameter is still undefined/default value, throw the
         * corresponding error.
        */
        const initParams = {
            amount: undefined,
            unit: undefined
        };

        return new Ether(params, error, initParams);
    }
}
