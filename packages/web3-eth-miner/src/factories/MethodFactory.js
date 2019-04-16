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
 * @file MethodFactory.js
 * @author Prince Sinha <sinhaprince013@gmail.com>
 * @date 2019
 */

import {
    AbstractMethodFactory,
    SetEtherBaseMethod,
    SetExtraMethod,
    SetGasPriceMethod,
    StartMiningMethod,
    StopMiningMethod
} from 'web3-core-method';

export default class MethodFactory extends AbstractMethodFactory {
    /**
     * @param {Utils} utils
     * @param {Object} formatters
     *
     * @constructor
     */
    constructor(utils, formatters) {
        super(utils, formatters);

        this.methods = {
            setEtherbase: SetEtherBaseMethod,
            setExtra: SetExtraMethod,
            setGasPrice: SetGasPriceMethod,
            startMining: StartMiningMethod,
            stopMining: StopMiningMethod
        };
    }
}
