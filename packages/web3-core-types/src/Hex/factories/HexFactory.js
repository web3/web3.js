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
 * @file HexFactory.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import Hex from '../Hex';

export default class HexFactory {
    /**
     * Returns an object of Hex Hex
     *
     * @method createHex
     *
     * @returns {Hex}
     */
    createHex(params) {
        /* Set the error messages */

        /* These should contain the error messages that explain
         * why an object creation failed.
        */
        const error = {
            hex: (value) =>
                `The 'hex' parameter ${value} needs to be a string composed of numbers, and characters between 'a' and 'f'.\n` +
                "Use 'empty' to set a web3 empty hex object."
        };

        /* Initialise the params */
        /* All the params should be defaulted to
         * undefined. If by the end of the constructor execution
         * a parameter is still undefined/default value, throw the
         * corresponding error.
        */
        const initParams = {
            hex: undefined
        };

        return new Hex(params, error, initParams);
    }
}
