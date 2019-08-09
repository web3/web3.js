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

import isObject from 'lodash/isObject';
import cloneDeep from 'lodash/cloneDeep';

export default class AbstractType {
    /**
     * @param {any} value
     *
     * @constructor
     */
    constructor(value = {}) {
        this._rawValue = value;

        if (isObject(value)) {
            this._value = cloneDeep(value);
        }

        this._value = value;
    }

    /**
     * Setter for the rawValue property.
     *
     * @property value
     *
     * @param {any} value
     */
    set rawValue(value) {
        this._rawValue = value;
    }

    /**
     * Setter for the value property.
     *
     * @property value
     *
     * @returns {any}
     */
    get rawValue() {
        return this._rawValue;
    }

    /**
     * Getter for the value property
     *
     * @returns {any}
     */
    get value() {
        return this._value;
    }

    /**
     * Setter for the value property
     *
     * @returns {any}
     */
    set value(value) {
        this._value = value;
    }
}
