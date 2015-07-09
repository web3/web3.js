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
/** @file ipcprovider.js
 * @authors:
 *   Fabian Vogelsteller <fabian@ethdev.com>
 * @date 2015
 */

"use strict";

var utils = require('../utils/utils');
var errors = require('./errors');

var errorTimeout = '{"jsonrpc": "2.0", "error": {"code": -32603, "message": "IPC Request timed out for method  \'__method__\'"}, "id": "__id__"}';


var IpcProvider = function (path, net) {
    var _this = this;
    this.responseCallbacks = {};
    this.path = path;
    
    net = net || require('net');

    this.connection = net.connect({path: this.path});

    this.connection.on('error', function(e){
        console.error('IPC Connection Error', e);
        _this._timeout();
    });

    this.connection.on('end', function(){
        _this._timeout();
    }); 


    // LISTEN FOR CONNECTION RESPONSES
    this.connection.on('data', function(data) {
        /*jshint maxcomplexity: 6 */
        data = data.toString();

        // DE-CHUNKER
        var dechunkedData = data
            .replace(/\}\{/g,'}|--|{') // }{
            .replace(/\}\]\[\{/g,'}]|--|[{') // }][{
            .replace(/\}\[\{/g,'}|--|[{') // }[{
            .replace(/\}\]\{/g,'}]|--|{') // }]{
            .split('|--|');


        dechunkedData.forEach(function(data){

            // prepend the last chunk
            if(_this.lastChunk)
                data = _this.lastChunk + data;

            var result = data,
                id = null;

            try {
                result = JSON.parse(result);

            } catch(e) {

                _this.lastChunk = data;

                // start timeout to cancel all requests
                clearTimeout(_this.lastChunkTimeout);
                _this.lastChunkTimeout = setTimeout(function(){
                    _this.timeout();
                    throw errors.InvalidResponse(result);        
                }, 1000 * 15);

                return;
            }

            // cancel timeout and set chunk to null
            clearTimeout(_this.lastChunkTimeout);
            _this.lastChunk = null;

            // get the id which matches the returned id
            if(utils.isArray(result)) {
                result.forEach(function(load){
                    if(_this.responseCallbacks[load.id])
                        id = load.id;
                });
            } else {
                id = result.id;
            }

            // fire the callback
            if(_this.responseCallbacks[id]) {
                _this.responseCallbacks[id](null, result);
                delete _this.responseCallbacks[id];
            }
        });
    });
};

/**
Get the adds a callback to the responseCallbacks object,
which will be called if a response matching the response Id will arrive.

@method _getResponse
*/
IpcProvider.prototype._getResponse = function(payload, callback) {
    var id = payload.id || payload[0].id;
    var method = payload.method || payload[0].method;

    this.responseCallbacks[id] = callback;
    this.responseCallbacks[id].method = method;
};

/**
Timeout all requests when the end/error event is fired

@method _timeout
*/
IpcProvider.prototype._timeout = function() {
    for(var key in this.responseCallbacks) {
        if(this.responseCallbacks.hasOwnProperty(key)){
            this.responseCallbacks[key](errorTimeout.replace('__id__', key).replace('__method__', this.responseCallbacks[key].method));
            delete this.responseCallbacks[key];
        }
    }
};


/**
Check if the current connection is still valid.

@method isConnected
*/
IpcProvider.prototype.isConnected = function() {
    var _this = this;

    // try reconnect, when connection is gone
    setTimeout(function(){
        if(!_this.connection.writable)
            _this.connection.connect({path: _this.path});
    }, 0);

    return !!this.connection.writable;
};

IpcProvider.prototype.send = function (payload) {

    if(this.connection.writeSync) {

        // try reconnect, when connection is gone
        if(!this.connection.writable)
            this.connection.connect({path: this.path});

        var result = this.connection.writeSync(JSON.stringify(payload));

        try {
            result = JSON.parse(result);
        } catch(e) {
            throw errors.InvalidResponse(result);                
        }

        return result;

    } else {
        throw new Error('You tried to send "'+ payload.method +'" synchronously. Synchronous requests are not supported by the IPC provider.');
    }
};

IpcProvider.prototype.sendAsync = function (payload, callback) {
    // try reconnect, when connection is gone
    if(!this.connection.writable)
        this.connection.connect({path: this.path});


    this.connection.write(JSON.stringify(payload));
    this._getResponse(payload, callback);
};

module.exports = IpcProvider;

