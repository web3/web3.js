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
/** @file debug.js
 * @author Cody Burns <Cody.w.Burns@gmail.com>
 * @date 2018
 */

 "use strict";
 var Method = require('../method');


 function debug(web3) {
     this._requestManager = web3._requestManager;

     var self = this;

     methods().forEach(function(method) {
         method.attachToObject(self);
         method.setRequestManager(self._requestManager);
     });

 }

var methods = function () {

  var printBlock  =  new Method({
 			name: 'printBlock',
 			call: 'debug_printBlock',
 			params: 1
 		});

  var getBlockRlp =  new Method({
 			name: 'getBlockRlp',
 			call: 'debug_getBlockRlp',
 			params: 1
 		});

  var setHead =  new Method({
    	name: 'setHead',
 			call: 'debug_setHead',
 			params: 1
 		});

  var traceBlock =  new Method({
 			name: 'traceBlock',
 			call: 'debug_traceBlock',
 			params: 1
 		});

  var traceBlockFromFile =  new Method({
  		name: 'traceBlockFromFile',
 			call: 'debug_traceBlockFromFile',
 			params: 1
 		});

  var traceBlockByNumber =  new Method({
    	name: 'traceBlockByNumber',
 			call: 'debug_traceBlockByNumber',
 			params: 1
 		});
 	var traceBlockByHash =  new Method({
    	name: 'traceBlockByHash',
 			call: 'debug_traceBlockByHash',
 			params: 1
 		});

var seedHash =  new Method({
  		name: 'seedHash',
 			call: 'debug_seedHash',
 			params: 1
 		});

var dumpBlock =  new Method({
  		name: 'dumpBlock',
 			call: 'debug_dumpBlock',
 			params: 1
 		});
 	var chaindbProperty =  new Method({
    	name: 'chaindbProperty',
 			call: 'debug_chaindbProperty',
 			params: 1,
 			outputFormatter: console.log
 		});
 		var chaindbCompact =  new Method({
 			name: 'chaindbCompact',
 			call: 'debug_chaindbCompact',
 		});
 		var metrics =  new Method({
 			name: 'metrics',
 			call: 'debug_metrics',
 			params: 1
 		});
 		var verbosity =  new Method({
 			name: 'verbosity',
 			call: 'debug_verbosity',
 			params: 1
 		});
 		var vmodule =  new Method({
 			name: 'vmodule',
 			call: 'debug_vmodule',
 			params: 1
 		});
 		var backtraceAt =  new Method({
 			name: 'backtraceAt',
 			call: 'debug_backtraceAt',
 			params: 1,
 		});
 		var stacks =  new Method({
 			name: 'stacks',
 			call: 'debug_stacks',
 			params: 0,
 			outputFormatter: console.log
 		});
 		var freeOSMemory =  new Method({
 			name: 'freeOSMemory',
 			call: 'debug_freeOSMemory',
 			params: 0,
 		});
 		var setGCPercent  =  new Method({
 			name: 'setGCPercent',
 			call: 'debug_setGCPercent',
 			params: 1,
 		});
 		var memStats =  new Method({
 			name: 'memStats',
 			call: 'debug_memStats',
 			params: 0,
 		});
 		var gcStats  =  new Method({
 			name: 'gcStats',
 			call: 'debug_gcStats',
 			params: 0,
 		});
 		var cpuProfile =  new Method({
 			name: 'cpuProfile',
 			call: 'debug_cpuProfile',
 			params: 2
 		});
 		var startCPUProfile =  new Method({
 			name: 'startCPUProfile',
 			call: 'debug_startCPUProfile',
 			params: 1
 		});
 		var stopCPUProfile =  new Method({
 			name: 'stopCPUProfile',
 			call: 'debug_stopCPUProfile',
 			params: 0
 		});
 		var goTrace =  new Method({
 			name: 'goTrace',
 			call: 'debug_goTrace',
 			params: 2
 		});
 		var startGoTrace =  new Method({
 			name: 'startGoTrace',
 			call: 'debug_startGoTrace',
 			params: 1
 		});
 		var stopGoTrace =  new Method({
 			name: 'stopGoTrace',
 			call: 'debug_stopGoTrace',
 			params: 0
 		});
 		var blockProfile =  new Method({
 			name: 'blockProfile',
 			call: 'debug_blockProfile',
 			params: 2
 		});
 		var setBlockProfileRate =  new Method({
 			name: 'setBlockProfileRate',
 			call: 'debug_setBlockProfileRate',
 			params: 1
 		});
 		var writeBlockProfile =  new Method({
 			name: 'writeBlockProfile',
 			call: 'debug_writeBlockProfile',
 			params: 1
 		});
 		var writeMemProfile =  new Method({
 			name: 'writeMemProfile',
 			call: 'debug_writeMemProfile',
 			params: 1
 		});
 		var traceTransaction =  new Method({
 			name: 'traceTransaction',
 			call: 'debug_traceTransaction',
 			params: 2,
 			inputFormatter: [null, null]
 		});
 		var preimage =  new Method({
 			name: 'preimage',
 			call: 'debug_preimage',
 			params: 1,
 			inputFormatter: [null]
 		});
 		var getBadBlocks =  new Method({
 			name: 'getBadBlocks',
 			call: 'debug_getBadBlocks',
 			params: 0,
 		});
 		var storageRangeAt =  new Method({
 			name: 'storageRangeAt',
 			call: 'debug_storageRangeAt',
 			params: 5,
 		});
 return [
   printBlock,
   getBlockRlp,
   setHead,
   traceBlock,
   traceBlockFromFile,
   traceBlockByNumber,
   traceBlockByHash,
   seedHash,
   dumpBlock,
   chaindbProperty,
   chaindbCompact,
   metrics,
   verbosity,
   vmodule,
   backtraceAt,
   stacks,
   freeOSMemory,
   setGCPercent,
   memStats,
   gcStats,
   cpuProfile,
   startCPUProfile,
   stopCPUProfile,
   goTrace,
   startGoTrace,
   stopGoTrace,
   blockProfile,
   setBlockProfileRate,
   writeBlockProfile,
   writeMemProfile,
   traceTransaction,
   preimage,
   getBadBlocks,
   storageRangeAt
  ];
 };

 module.exports = debug;
