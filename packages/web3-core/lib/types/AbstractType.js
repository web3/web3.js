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
 * @file AbstractType
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2019
 */

export default class AbstractType {
    /**
     * @param {any} value
     *
     * @constructor
     */
    constructor(value) {
        this._value = null;
        this.value = value;
    }

    /**
     * Setter for the value property
     *
     * @property value
     *
     * @param {any} value
     */
    set value(value) {
        this._value = value;
    }

    /**
     * Getter for the value property.
     *
     * @property value
     *
     * @returns {any}
     */
    get value() {
        return this._value;
    }
}
