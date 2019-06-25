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
 * @file Type.js
 * @author Oscar Fonseca <hiro@cehh.io>
 * @date 2019
 */

import * as Types from '../index';
import {cloneDeep, isObject} from 'lodash';

export default class Type {
    /**
     * @param {types} parameter
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
                p1: params,
                p2: /* default safe value */
            }
        }
        
        /* 5) Check for type and format validity */
        this.props.p = /* condition check */
                ? /* parameter standarization */
                : undefined;


        /* 6) Check for default, auto, none, etc. key values */
        if (params.p === 'auto') this.props.p = /* default/auto/empty value */

        /* 7) Throw if any parameter is still undefined */
        Object.keys(this.props).forEach((key) => {
            typeof this.props[key] === 'undefined' && this._throw(this.error[key], params[key]);
        });
        
        /* 8) Make the props immutable */
        Object.freeze(this.props);
    }

    /**
     * Class functions
     *
     * @dev Methods that do not require the parameter to be of the class 
     * e.g. type checking
     */
    static foo(p1) {
      return 
    }

    /**
     * Instance accessors
     *
     * @dev Methods require a valid instance of the class
     * e.g. object parsing
     */
    foo() {
      return Type.foo(/* this value */);
    }
  
    bar() {
      return castTo(/* this value */);
    }

    /**
     * isType
     * @dev add this as a function property to quickly check
     *      if the object is of type Type
     */
    isType() {
      return true;
    }

    /**
     * _throw is wrap the error throw when checking for parsing errors
     */
    _throw(message, value) {
        throw message(value);
    }
}
