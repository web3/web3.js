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
/** @file syncing.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

var RequestManager = require('./requestmanager');
var Method = require('./method');
var formatters = require('./formatters');
var utils = require('../utils/utils');



/**
Adds the callback and sets up the methods, to iterate over the results.

@method pollSyncing
@param {Object} self
*/
var pollSyncing = function(self) {
    var lastSyncState = false;

    var onMessage = function (error, sync) {
        if (error) {
            return self.callbacks.forEach(function (callback) {
                callback(error);
            });
        }

        if(utils.isObject(sync))
            sync = self.implementation.outputFormatter(sync);

        self.callbacks.forEach(function (callback) {
            if(lastSyncState !== sync) {
                
                // call the callback with true first so the app can stop anything, before receiving the sync data
                if(!lastSyncState && utils.isObject(sync))
                    callback(null, true);
                
                // call on the next CPU cycle, so the actions of the sync stop can be processes first
                setTimeout(function() {
                    callback(null, sync);
                }, 1);
                
                lastSyncState = sync;
            }
        });
    };

    RequestManager.getInstance().startPolling({
        method: self.implementation.call,
        params: [],
    }, self.pollId, onMessage, self.stopWatching.bind(self));

};

var IsSyncing = function (callback) {
    this.pollId = 'syncPoll_'+ Math.floor(Math.random() * 1000);
    this.callbacks = [];
    this.implementation = new Method({
        name: 'isSyncing',
        call: 'eth_syncing',
        params: 0,
        outputFormatter: formatters.outputSyncingFormatter
    });

    this.addCallback(callback);
    pollSyncing(this);

    return this;
};

IsSyncing.prototype.addCallback = function (callback) {
    if(callback)
        this.callbacks.push(callback);
    return this;
};

IsSyncing.prototype.stopWatching = function () {
    RequestManager.getInstance().stopPolling(this.pollId);
    this.callbacks = [];
};

module.exports = IsSyncing;

