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
 * @file AddressFactory.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import Address from '../Address';

export default class AddressFactory {
    /**
     * Returns an object of type Address
     *
     * @method createAddress
     *
     * @returns {Address}
     */
    createAddress(params) {
        /* Set the error messages */
        const error = {
            address: 'The address needs to be hex encoded, supplied as a string.',
            isChecksummed:
                "The parameter 'isChecksum' needs to be true or false.\ntrue means the supplied address is checksummed. false means the address may or may not be checksummed."
        };

        /* Initialise the params */
        const initParams = {
            address: undefined,
            isChecksummed: undefined
        };

        return new Address(params, error, initParams);
    }
}
