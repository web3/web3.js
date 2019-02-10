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
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import EtherClass from './Ether';
import EtherFactory from './factories/EtherFactory';

/**
 * Returns an object of Ether 
 *
 * @returns {Ether}
 *
 * @constructor
 */
export const Ether = (params) => {
    return new EtherFactory().createEther(params);
};

export const Wei = (wei) => {
    const params = {amount: wei, unit: 'wei'};
    return Ether(params);
}

export const Gwei = (gwei) => {
    const params = {amount: gwei, unit: 'gwei'};
    return Ether(params);
}

export const Finney = (finney) => {
    const params = {amount: finney, unit: 'finney'};
    return Ether(params);
}
