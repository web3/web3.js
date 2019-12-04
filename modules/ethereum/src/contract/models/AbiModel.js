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
 * @file AbiModel.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class AbiModel {
    /**
     * @param {Object} mappedAbi
     *
     * @constructor
     */
    constructor(mappedAbi) {
        this.abi = mappedAbi;
    }

    /**
     * Checks if the method exists and returns it otherwise it will return false
     *
     * @method getMethod
     *
     * @param {String} name
     *
     * @returns {AbiItemModel|Boolean}
     */
    getMethod(name) {
        if (this.hasMethod(name)) {
            return this.abi.methods[name];
        }

        return false;
    }

    /**
     * Returns all methods from this AbiModel
     *
     * @method getMethods
     *
     * @returns {Object}
     */
    getMethods() {
        return this.abi.methods;
    }

    /**
     * Checks if the event exists and returns it otherwise it will return false
     *
     * @method getEvent
     *
     * @param {String} name
     *
     * @returns {AbiItemModel|Boolean}
     */
    getEvent(name) {
        if (this.hasEvent(name)) {
            return this.abi.events[name];
        }

        return false;
    }

    /**
     * Returns all events from this AbiModel
     *
     * @method getEvents
     *
     * @returns {Object}
     */
    getEvents() {
        return this.abi.events;
    }

    /**
     * Returns an event by his signature
     *
     * @method getEventBySignature
     *
     * @param {String} signature
     *
     * @returns {AbiItemModel}
     */
    getEventBySignature(signature) {
        let event;

        Object.keys(this.abi.events).forEach((key) => {
            if (this.abi.events[key].signature === signature) {
                event = this.abi.events[key];
            }
        });

        return event;
    }

    /**
     * Checks if the method exists
     *
     * @method hasMethod
     *
     * @param {String} name
     *
     * @returns {Boolean}
     */
    hasMethod(name) {
        return typeof this.abi.methods[name] !== 'undefined';
    }

    /**
     * Checks if the event exists
     *
     * @method hasEvent
     *
     * @param {String} name
     *
     * @returns {Boolean}
     */
    hasEvent(name) {
        return typeof this.abi.events[name] !== 'undefined';
    }
}
