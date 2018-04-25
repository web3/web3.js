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
/** @file geth.js
 * @author Cody Burns <Cody.w.BUrns@gmail.com>
 * @date 2018
 */

 "use strict";

 var Method = require('../method');
 var formatters = require('../formatters');


 function geth(web3) {
     this._requestManager = web3._requestManager;

     var self = this;

     methods().forEach(function(method) {
         method.attachToObject(self);
         method.setRequestManager(self._requestManager);
     });

 }

 var methods = function () {

      var getAddressTransactions =  new Method({
              name: 'getAddressTransactions',
              call: 'geth__getAddressTransactions',
              params: 9,
              inputFormatter: [formatters.getAddressTransactions]
            });

            return [
              getAddressTransactions
             ];
           };

 module.exports = geth;
