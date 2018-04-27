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
/** @file istanbul.js
 * @author Cody Burns <Cody.w.Burns@gmail.com>
 * @date 2018
 */

 "use strict";
 var Method = require('../method');
 var Property = require('../property');


 function Istanbul(web3) {
     this._requestManager = web3._requestManager;

     var self = this;

     methods().forEach(function(method) {
         method.attachToObject(self);
         method.setRequestManager(self._requestManager);
     });

 }


 var methods = function () {
    var getSnapshot =  new Method({
     name: 'getSnapshot',
     call: 'istanbul_getSnapshot',
     params: 1
    }),
    var getSnapshotAtHash =  new Methodd({
     name: 'getSnapshotAtHash',
     call: 'istanbul_getSnapshotAtHash',
     params: 1
   }),
    var getValidators =  new Method({
     name: 'getValidators',
     call: 'istanbul_getValidators',
     params: 1
    }),
    var getValidatorsAtHash =  new Method({
     name: 'getValidatorsAtHash',
     call: 'istanbul_getValidatorsAtHash',
     params: 1
   }),
    var propose  =  new Method({
     name: 'propose',
     call: 'istanbul_propose',
     params: 2
   }),
    var discard  =  new Methodd({
     name: 'discard',
     call: 'istanbul_discard',
     params: 1
   })
   return [
     getSnapshot,
     getSnapshotAtHash,
     getValidators,
     getValidatorsAtHash,
     propose,
     discard
   ];
};

var properties = function () {
    return [
        new Property({
            name: 'candidates',
            getter: 'istanbul_candidates'
        })
    ];
};

module.exports = Istanbul;
