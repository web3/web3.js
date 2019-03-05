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
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import * as Utils from 'web3-utils';
import {AbiCoder as EthersAbiCoder} from 'ethers/utils/abi-coder';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import EthAbiCoder from './AbiCoder.js';

/**
 * Returns an object of AbiCoder
 *
 * @returns {AbiCoder}
 *
 * @constructor
 */
export const AbiCoder = () => {
    return new EthAbiCoder(
        Utils,
        // TODO: Change this anonymous method to a accessable method because of the testing.
        new EthersAbiCoder((type, value) => {
            if (
                (type.match(/^u?int/) && !isArray(value) && !isObject(value)) ||
                value.constructor.name === 'BigNumber'
            ) {
                return value.toString();
            }

            return value;
        })
    );
};
