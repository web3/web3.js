/*
    This file is part of ethereum.js.

    ethereum.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    ethereum.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with ethereum.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/** 
 * @file abi.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @author Gav Wood <g@ethdev.com>
 * @date 2014
 */

var coder = require('./coder');
var utils = require('./utils');

var formatConstructorParams = function (abi, params) {
    var constructor = utils.getConstructor(abi, params.length);
    if (!constructor) {
        if (params.length > 0) {
            console.warn("didn't found matching constructor, using default one");
        }
        return '';
    }

    return coder.encodeParams(constructor.inputs.map(function (input) {
        return input.type;
    }), params);
};

module.exports = {
    formatConstructorParams: formatConstructorParams
};

