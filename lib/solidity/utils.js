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
 * @file utils.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

/**
 * Returns the contstructor with matching number of arguments
 *
 * @method getConstructor
 * @param {Array} abi
 * @param {Number} numberOfArgs
 * @returns {Object} constructor function abi
 */
var getConstructor = function (abi, numberOfArgs) {
    return abi.filter(function (f) {
        return f.type === 'constructor' && f.inputs.length === numberOfArgs;
    })[0];
};

//var getSupremeType = function (type) {
    //return type.substr(0, type.indexOf('[')) + ']';
//};


module.exports = {
    getConstructor: getConstructor
};

