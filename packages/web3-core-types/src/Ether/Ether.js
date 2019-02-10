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
 * @file Ether.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import * as Types from '../index';
import {toBN} from 'web3-utils';
import {cloneDeep, isObject, isString, isNumber} from 'lodash';

/* Unit map from ethjs-unit */
const unitMap = {
  'noether':      '0', // eslint-disable-line
  'wei':          '1', // eslint-disable-line
  'kwei':         '1000', // eslint-disable-line
  'Kwei':         '1000', // eslint-disable-line
  'babbage':      '1000', // eslint-disable-line
  'femtoether':   '1000', // eslint-disable-line
  'mwei':         '1000000', // eslint-disable-line
  'Mwei':         '1000000', // eslint-disable-line
  'lovelace':     '1000000', // eslint-disable-line
  'picoether':    '1000000', // eslint-disable-line
  'gwei':         '1000000000', // eslint-disable-line
  'Gwei':         '1000000000', // eslint-disable-line
  'shannon':      '1000000000', // eslint-disable-line
  'nanoether':    '1000000000', // eslint-disable-line
  'nano':         '1000000000', // eslint-disable-line
  'szabo':        '1000000000000', // eslint-disable-line
  'microether':   '1000000000000', // eslint-disable-line
  'micro':        '1000000000000', // eslint-disable-line
  'finney':       '1000000000000000', // eslint-disable-line
  'milliether':   '1000000000000000', // eslint-disable-line
  'milli':        '1000000000000000', // eslint-disable-line
  'ether':        '1000000000000000000', // eslint-disable-line
  'kether':       '1000000000000000000000', // eslint-disable-line
  'grand':        '1000000000000000000000', // eslint-disable-line
  'mether':       '1000000000000000000000000', // eslint-disable-line
  'gether':       '1000000000000000000000000000', // eslint-disable-line
  'tether':       '1000000000000000000000000000000', // eslint-disable-line
};

export default class Ether {
    /**
     * @dev {} parameter
     *
     * @constructor
     */
    constructor(params, error /* from factory */, initParams /* from factory */) {

        /* -) params are the values given to the constructor
         * -) this.props are the params fed via the constructor
         *      after being filtered.
         * -) this.props start assigned to undefined via initParams */

        /* 1) Set the errors */
        this.error = error; 

        /* 2) Set the initial values */
        this.initParams = initParams; 
        
        /* 3) Initialize the parameters */
        this.props = cloneDeep(initParams); 
      
        /* 4) Reshape params to emulate different constructor overrides */
        if(!isObject(params)) {
            params = {
                amount: params,
                unit: 'ether'
            }
        }
        
        /* 5) Check for type and format validity */
        this.props.unit = isString(params.unit) && Object.keys(unitMap).indexOf(params.unit.toLowerCase()) > -1
                ? params.unit.toLowerCase()
                : undefined;

        this.props.amount = /^[0-9]+(\.[0-9]+)?$/i.test(params.amount)
                ? params.amount.toString()
                : undefined;

        /* 7) Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });
        
        /* 8) Make the props immutable */
        Object.freeze(this.props);
    }
    
    /**
     * Parse the created unit to wei
     *
     * @method toWei
     *
     * @return {String}
     */
    toWei() {
      return toBN(this.props.amount).mul(toBN(unitMap[this.props.unit])).toString();
    }
    
    /**
     * Parse the created unit to another unit
     *
     * @method toUnit
     *
     * @return {String}
     */
    toUnit(unit) {
      if(Object.keys(unitMap).indexOf(this.props.unit) === -1)
        throw Error(`The given unit name ${unit} is unknown.`);

      const from = unitMap[this.props.unit];
      const to = unitMap[unit];

      return toBN(this.props.amount).mul(toBN(from)).div(toBN(to)).toString();
    }
    
    /**
     * Override toString to print the unit information
     *
     * @method toString
     *
     * @return {String}
     */
    toString() {
        return `${this.props.amount} ${this.props.unit}`;
    }

    /**
     * isEther
     * @dev add this as a function property to quickly check
     *      if the object is of type Ether
     */
    isEther() {
      return true;
    }

    /**
     * _throw is wrap the error throw when checking for parsing errors
     */
    _throw(message, value) {
        throw message(value);
    }
}
