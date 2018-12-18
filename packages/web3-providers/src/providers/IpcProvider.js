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
 * @file index.js
 * @authors: Samuel Furter <samuel@ethereum.org>, Fabian Vogelsteller <fabian@ethereum.org>
 * @date 2018
 */

import oboe from 'oboe';
import AbstractSocketProvider from '../../lib/providers/AbstractSocketProvider';

export default class IpcProvider extends AbstractSocketProvider {
    /**
     * @param {String} path
     * @param {Net} net
     *
     * @constructor
     */
    constructor(path, net) {
        super(net.connect({path: path}), null);
        this.net = net;
    }

    /**
     * Registers all the required listeners.
     *
     * @method registerEventListeners
     */
    registerEventListeners() {
        if (this.net.constructor.name === 'Socket') {
            oboe(this.connection).done(this.onMessage);
        } else {
            this.connection.addEventListener('data', message =>  {
                this.onMessage(message.toString());
            });
        }
        super.registerEventListeners();
    }

    /**
     * Try to reconnect
     *
     * TODO: create reconnect method also for the websocket provider
     *
     * @method reconnect
     */
    reconnect() {
        // this.connection.connect({path: this.path});
    }

    /**
     * Sends the JSON-RPC request
     *
     * @method send
     *
     * @param {Object} payload
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     */
    send(payload, callback) {
        // // try reconnect, when connection is gone
        // if (!this.connection.writable) {
        //     this.connection.connect({path: this.path});
        // }
        //
        // this.connection.write(JSON.stringify(payload));
        // this.addResponseCallback(payload, callback);
    }
}
