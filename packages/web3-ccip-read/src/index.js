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

//keccak256 hash of: OffchainLookup(address,string[],bytes,bytes4,bytes)
const ENCODED_CCIP_READ_ERROR_SELECTOR = '0x556f1830';
const MAX_REDIRECT_COUNT = 4;
const OFFCHAIN_LOOKUP_PARAMETER_TYPES = ['address', 'string[]', 'bytes', 'bytes4', 'bytes'];

const CCIP_READ_INTERFACE = new Interface([
    'function callback(bytes memory result, bytes memory extraData)',
]);

var gatewayQuery = function (url, to, calldata) {
    if(!url) throw new Error('No gateway url was provided');

    var httpObject = new http.Http();

    const lowerTo = to.toLowerCase();
    const lowerCalldata = calldata.toLowerCase();

    const senderUrl = url.replace('{sender}', lowerTo);

    if(url.includes('{data}')) {
        return httpObject.get(`${senderUrl.replace('{data}', lowerCalldata)}.json`);
    }

    return httpObject.post(senderUrl, {sender: lowerTo, data: lowerCalldata});
};

var formatGatewayError = function (errorResponse) {
    return `Gateway query error: ${errorResponse.status} ${errorResponse.statusText} \n ${errorResponse.responseText}`;
};

var isUrlAllowed = function (urlInstance, allowList) {
    if(!allowList || !(allowList && allowList.length)) return true;
    return allowList.includes(urlInstance.hostname);
};

var hasCcipReadFunctionSelector = function (encodedString) {
    return encodedString && encodedString.substring(0, 10) === ENCODED_CCIP_READ_ERROR_SELECTOR;
};

//Errors are handled differently depending on the environment
var normalizeResponse = function (error, result) {
    console.log('error: ', error);
    console.log('result: ', result);

    const defaultResponse = {
        data: ''
    };

    if (!error && !result) {
        return defaultResponse;
    }

    if (typeof error === "string" && hasCcipReadFunctionSelector(error)) {
        return {
            data: error
        };
    }

    if (typeof result === "string" && hasCcipReadFunctionSelector(result)) {
        return {
            data: result
        };
    }

    if (
        typeof error === 'object' &&
        hasCcipReadFunctionSelector(error && error.data)
    ) {
        return {
            data: error.data
        };
    }

    return defaultResponse;
};

/**
 * Loop through gateway urls in order to fetch off-chain data
 *
 * @method callGateways
 *
 * @param {Array} urls
 * @param {} to
 * @param {Error} err
 * @param {Object} result
 *
 * @return {Boolean} true if reversion was a CCIP-Read error
 */
var callGateways = async function (urls, to, callData, allowList) {
    for (const url of urls) {
        let urlInstance;
        try {
            urlInstance = new URL(url);
        } catch(e) {
            console.warn('Skipping gateway url ${url} as it is malformed');
            continue;
        }

        if(!isUrlAllowed(urlInstance, allowList)) {
            console.warn(`Gateway at ${url} not called due to allow list rules`);
            continue;
        }

        let response;
        try {
            response = await gatewayQuery(url, to, callData);
            console.log('response: ', response);
            if (response.status >= 200 && response.status <= 299) {
                return response;
            }
        } catch (errorResponse) {
            console.log('errorResponse: ', errorResponse);
            const formattedError = formatGatewayError(errorResponse);

            if (errorResponse.status >= 400 && errorResponse.status <= 499) {
                throw new Error(formattedError);
            }

            //5xx errors
            console.warn(formattedError);
        }
    }

    // throw new Error('All gateways failed');
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
 * Gather off-chain data via the CCIP-read protocol
 *
 * @method ccipReadCall
 *
 * @param {Error} errorObject
 * @param {Object} result
 * @param {Object} payload
 * @param {Function} send
 * @param {Object} options
 *
 * @return {Object} Result of calling send with off-chain data
 */
var ccipReadCall = async function (errorObject, result, payload, send, options) {
    if (send.ccipReadCalls) {
        send.ccipReadCalls++;
    } else {
        send.ccipReadCalls = 1;
    }
    if (send.ccipReadCalls > (options.ccipReadMaxRedirectCount || MAX_REDIRECT_COUNT)) {
        throw new Error('Too many CCIP-read redirects');
    }

    const normalizedResponse = normalizeResponse(errorObject, result);
    if (!normalizedResponse.data) {
        throw new Error('ccipReadCall called for a non-CCIP-read compliant error');
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

    if(!finalUrls.length) {
        throw new Error('No gateway urls provided');
    }

    let gatewayResult;
    if(options.ccipReadGatewayCallback) {
        try{
            gatewayResult = await options.ccipReadGatewayCallback(finalUrls, sender, callData, options.ccipReadGatewayAllowList);
        } catch(e) {
            console.error('ccipReadGatewayCallback error.');
            throw e;
        }
    } else {
        const result = await callGateways(finalUrls, sender, callData, options.ccipReadGatewayAllowList);
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
    ccipReadCall,
    callGateways,
};
