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
/** @file zsl.js
 * @author Cody Burns <Cody.w.BUrns@gmail.com>
 * @date 2018
 */

 "use strict";
 var Method = require('../method');


 function zsl(web3) {
     this._requestManager = web3._requestManager;

     var self = this;

     methods().forEach(function(method) {
         method.attachToObject(self);
         method.setRequestManager(self._requestManager);
     });

 }

 var methods = function () {

      var loadTracker =  new Method({
        			name: 'loadTracker',
        			call: 'zsl_loadTracker',
        			params: 1
        		});

      var saveTracker =  new Method({
        			name: 'saveTracker',
        			call: 'zsl_saveTracker',
        			params: 2
        		});

      var  getCommitment = new Method({
        			name: 'getCommitment',
        			call: 'zsl_getCommitment',
        			params: 3
        		});

      var getSendNullifier = new Method({
        			name: 'getSendNullifier',
        			call: 'zsl_getSendNullifier',
        			params: 1
        		});

      var getSpendNullifier =  new Method({
        			name: 'getSpendNullifier',
        			call: 'zsl_getSpendNullifier',
        			params: 2
        		});

      var createShielding = new Method({
        			name: 'createShielding',
        			call: 'zsl_createShielding',
        			params: 3
        		});

      var createUnshielding=  new Method({
        			name: 'createUnshielding',
        			call: 'zsl_createUnshielding',
        			params: 5
        		});

      var createShieldedTransfer =  new Method({
        			name: 'createShieldedTransfer',
        			call: 'zsl_createShieldedTransfer',
        			params: 16
        		});

      var verifyShieldedTransfer =  new Method({
        			name: 'verifyShieldedTransfer',
        			call: 'zsl_verifyShieldedTransfer',
        			params: 8
        		});

      var verifyShielding =  new Method({
        			name: 'verifyShielding',
        			call: 'zsl_verifyShielding',
        			params: 4
        		});

      var verifyUnshielding =  new Method({
        			name: 'verifyUnshielding',
        			call: 'zsl_verifyUnshielding',
        			params: 4
        		});

      var getNewAddress =  new Method({
        			name: 'getNewAddress',
        			call: 'zsl_getNewAddress',
        			params: 0
        		});

      var getRandomness =  new Method({
        			name: 'getRandomness',
        			call: 'zsl_getRandomness',
        			params: 0
        		});

      var debugShielding =  new Method({
        			name: 'debugShielding',
        			call: 'zsl_debugShielding',
        			params: 0
        		});
      var debugUnshielding =  new Method({
        			name: 'debugUnshielding',
        			call: 'zsl_debugUnshielding',
        			params: 0
        		});

      var debugShieldedTransfer =  new Method({
        			name: 'debugShieldedTransfer',
        			call: 'zsl_debugShieldedTransfer',
        			params: 0
        		});

       return [
          loadTracker,
          saveTracker,
          getCommitment,
          getSendNullifier,
          createShielding,
          createUnshielding,
          createShieldedTransfer,
          verifyShieldedTransfer,
          verifyShielding,
          verifyUnshielding,
          getNewAddress,
          getRandomness,
          debugShielding,
          debugUnshielding,
          debugShieldedTransfer
        ];
 };

 module.exports = zsl;
