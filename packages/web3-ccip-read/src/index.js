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
 * @author Leon Talbert <leon@ens.domains>
 * @date 2022
 */

var abi = require('web3-eth-abi');
var http = require('web3-http');
var {defaultAbiCoder, Interface} = require('@ethersproject/abi');
var {hexConcat} = require('@ethersproject/bytes');

const ENCODED_CCIP_READ_FUNCTION_SELECTOR = '556f1830';
const MAX_REDIRECT_COUNT = 4;
const OFFCHAIN_LOOKUP_PARAMETER_TYPES = ['address', 'string[]', 'bytes', 'bytes4', 'bytes'];

const CCIP_READ_INTERFACE = new Interface([
    'function callback(bytes memory result, bytes memory extraData)',
]);

var gatewayQuery = function (url, to, calldata) {
    var httpObject = new http.Http();

    const lowerTo = to.toLowerCase();
    const lowerCalldata = calldata.toLowerCase();

    const senderUrl = url.replace('{sender}', lowerTo);

    if(!url) throw new Error('No gateway url was provided');

    if(url.includes('{data}')) {
        return httpObject.get(`${senderUrl.replace('{data}', lowerCalldata)}.json`);
    }

    return httpObject.post(senderUrl, {sender: lowerTo, data: lowerCalldata});
};

var callGateway = async function (urls, to, callData) {

    for (const url of urls) {
        let response;

        try {
            response = await gatewayQuery(url, to, callData);
            if (response.status >= 200 && response.status <= 299) {
                return response;
            }
        } catch (errorResponse) {
            if (errorResponse.status >= 400 && errorResponse.status <= 499) {
                throw new Error('There was a problem fetching data from the gateway');
            }
        }

        console.warn(`Gateway "${url}" failed`);
    }

    throw new Error('All gateways failed');
};

var hasCcipReadFunctionSelector = function (encodedString) {
    return encodedString && encodedString.substring(0, 10) === `0x${ENCODED_CCIP_READ_FUNCTION_SELECTOR}`;
};

//Errors are handled differently depending on the environment
var normalizeResponse = function (errorObject, result) {
    const defaultResponse = {
        data: ''
    };

    if (!errorObject && !result) {
        return defaultResponse;
    }

    if (typeof errorObject === "string" && hasCcipReadFunctionSelector(errorObject)) {
        return {
            data: errorObject
        };
    }

    if (typeof result === "string" && hasCcipReadFunctionSelector(result)) {
        return {
            data: result
        };
    }

    if (
        typeof errorObject === 'object' &&
        hasCcipReadFunctionSelector(errorObject && errorObject.data)
    ) {
        return {
            data: errorObject.data
        };
    }

    return defaultResponse;
};

/**
 * Determine if revert is a CCIP-Read error
 *
 * @method isOffChainLookup
 *
 * @param {Error} err
 * @param {Object} result
 *
 * @return {Boolean} true if reversion was a CCIP-Read error
 */
var isOffChainLookup = function (err, result) {
    const normalizedResponse = normalizeResponse(err, result);
    return !!normalizedResponse.data;
};

/**
 * Should be used to encode list of params
 *
 * @method encodeParameters
 *
 * @param {Array<String|Object>} types
 * @param {Array<any>} params
 *
 * @return {String} encoded list of params
 */
var ccipReadCall = async function (errorObject, result, payload, send, options) {
    if (send.ccipReadCalls) {
        send.ccipReadCalls++;
    } else {
        send.ccipReadCalls = 1;
    }
    if (send.ccipReadCalls > MAX_REDIRECT_COUNT) {
        throw new Error('Too many CCIP-Read redirects');
    }

    const normalizedResponse = normalizeResponse(errorObject, result);
    if (!normalizedResponse.data) {
        throw new Error('ccipReadCall called for a non-CCIP-Read compliant error');
    }

    const [sender, urls, callData, callbackFunction, extraData] = Object.values(
        abi.decodeParameters(OFFCHAIN_LOOKUP_PARAMETER_TYPES, `${normalizedResponse.data.substring(10)}`)
    );

    if (
        (sender && sender.toLowerCase()) !==
        (payload && payload.params && payload.params[0] && payload.params[0].to && payload.params[0].to.toLowerCase())
    ) {
        throw new Error('CCIP-read error: sender does match contract address');
    }


    let finalUrls;
    if(options.ccipReadGatewayUrls.length) {
        finalUrls = options.ccipReadGatewayUrls;
    } else {
        finalUrls = urls;
    }

    let gatewayResult;
    if(options.ccipReadGatewayCallback) {
        try{
            gatewayResult = await options.ccipReadGatewayCallback(finalUrls, sender, callData);
        } catch(e) {
            console.error('ccipReadGatewayCallback error.');
            throw e;
        }
    } else {
        const result = await callGateway(finalUrls, sender, callData);
        gatewayResult = result.response.data;
    }

    const nextCall = hexConcat([
        callbackFunction,
        defaultAbiCoder.encode(CCIP_READ_INTERFACE.getFunction('callback').inputs, [gatewayResult, extraData]),
    ]);

    return send({
        to: sender,
        data: nextCall
    });
};

module.exports = {
    isOffChainLookup,
    ccipReadCall
};
