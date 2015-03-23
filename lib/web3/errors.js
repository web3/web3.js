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
 * @file errors.js
 * @author Marek Kotewicz <marek@ethdev.com>
 * @date 2015
 */

var utils = require('../utils/utils');

module.exports = {
    InvalidNumberOfParams: new Error('Invalid number of input parameters'),
    InvalidProvider: new Error('Providor not set or invalid'),
    InvalidResponse: function(result){
        var message = 'Invalid JSON RPC response';

        if(utils.isObject(result) && result.error && result.error.message) {
            message = result.error.message;
        }

        return new Error(message);
    }
};

