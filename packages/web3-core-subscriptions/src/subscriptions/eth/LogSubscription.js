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
 * @file LogSubscription.js
 * @authors: Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import AbstractSubscription from '../../../lib/subscriptions/AbstractSubscription'
import isFunction from 'lodash/isFunction'
import reject from 'lodash/reject'
import isUndefined from 'lodash/isUndefined'
import isObject from 'lodash/isObject'
import isArray from 'lodash/isArray'
import pickBy from 'lodash/pickBy'
import isString from 'lodash/isString'

// TODO: Move the past logs logic to the eth module
export default class LogSubscription extends AbstractSubscription {
    /**
     * @param {Object} options
     * @param {Utils} utils
     * @param {Object} formatters
     * @param {GetPastLogsMethod} getPastLogsMethod
     * @param {AbstractWeb3Module} moduleInstance
     *
     * @constructor
     */
    constructor(options, utils, formatters, moduleInstance, getPastLogsMethod) {
        super('eth_subscribe', 'logs', options, utils, formatters, moduleInstance)
        this.getPastLogsMethod = getPastLogsMethod
        this.logSubscriptionOptions = ['address', 'topics']
    }

    /**
     * Validate options
     *
     * @method validate
     *
     * @param {Object} options
     *
     * @returns {Error | Boolean } if find an invalid option will throw an error
     */
    validate(options) {
        if (isObject(options)) {
            let rejectedOptions = reject(Object.keys(options), option => {
                return this.logSubscriptionOptions.some(
                    parameter => parameter == option
                )
            })

            if (rejectedOptions.length > 0) {
                return new Error(
                    `Validation error: This option(s) are not valid <${rejectedOptions}>`
                )
            }

            if (!isUndefined(options.topics)) {
                if (!isArray(options.topics)) {
                    return new Error('Validation error: topics need to be an array')
                } else {
                    const topics = options.topics
                    for (let i = 0; i < topics.length; i++) {
                        if (!this.utils.isTopic(topics[i])) {
                            return new Error(
                                `Validation error: Provided Topic ${topics[i]} is invalid`
                            )
                        }
                    }
                }
            }

            if (!isUndefined(options.address)) {
                const addresses = isString(options.address) ?
                    [options.address] :
                    options.address
                for (let i = 0; i < addresses.length; i++) {
                    if (!this.utils.isAddress(addresses[i])) {
                        return new Error(
                            `Validation error: Provided address ${addresses[i]} is invalid`
                        )
                    }
                }
            }

            return true
        }
        return new Error('Validation error: Options should be of type Object')
    }

    /**
     * Validate get past logs filters
     *
     * @method validateGetPastLogsFilters
     *
     * @param {Object} options
     *
     * @returns {Object}
     */
    validateGetPastLogsFilters(filters) {
        if (!isUndefined(filters.toBlock)) {
            if (!isUndefined(filters.blockHash)) {
                return new Error(
                    'Validation error: BlockHash is present in the filter criteria, then neither fromBlock or toBlock are allowed.'
                )
            }

            if (filters.fromBlock == 'latest' && filters.toBlock == 'latest') {
                return new Error(
                    'Validation error: fromBlock and toBlock are set to latest, consider to remove filters'
                )
            }
        }
        return true
    }

    /**
     * Reject invalid options
     *
     * @method rejectInvalidLogSubscriptions
     *
     * @param {Object} options
     *
     * @returns {Object}
     */
    rejectInvalidLogSubscriptions(options) {
        return pickBy(options, (_, option) =>
            this.logSubscriptionOptions.some(logOption => logOption == option)
        )
    }

    /**
     * Sends the JSON-RPC request, emits the required events and executes the callback method.
     *
     * @method subscribe
     *
     * @param {Function} callback
     *
     * @callback callback callback(error, result)
     * @returns {Subscription} Subscription
     */
    subscribe(callback) {
        if (
            (this.options.fromBlock && this.options.fromBlock !== 'latest') ||
            this.options.fromBlock === 0
        ) {
            this.options = this.formatters.inputLogFormatter(this.options)

            const getPastLogsFiltersResult = this.validateGetPastLogsFilters(
                this.options
            )
            if (getPastLogsFiltersResult instanceof Error) {
                if (isFunction(callback)) {
                    callback(getPastLogsFiltersResult, null)
                }
                this.emit('error', getPastLogsFiltersResult)
            } else {
                this.getPastLogsMethod.parameters = [this.options]
                this.getPastLogsMethod
                    .execute()
                    .then(logs => {
                        logs.forEach(log => {
                            const formattedLog = this.onNewSubscriptionItem(log)

                            if (isFunction(callback)) {
                                callback(false, formattedLog)
                            }

                            this.emit('data', formattedLog)
                        })

                        this.options = this.rejectInvalidLogSubscriptions(this.options)
                        super.subscribe(callback)
                    })
                    .catch(error => {
                        if (isFunction(callback)) {
                            callback(error, null)
                        }

                        this.emit('error', error)
                    })
            }

            return this
        }

        const validationResult = this.validate(this.options)

        if (validationResult instanceof Error) {
            if (isFunction(callback)) {
                callback(validationResult, null)
            }
            this.emit('error', validationResult)
        } else {
            super.subscribe(callback)
        }

        return this
    }

    /**
     * This method will be executed on each new subscription item.
     *
     * @method onNewSubscriptionItem
     *
     * @param {Object} subscriptionItem
     *
     * @returns {Object}
     */
    onNewSubscriptionItem(subscriptionItem) {
        const log = this.formatters.outputLogFormatter(subscriptionItem)

        if (log.removed) {
            this.emit('changed', log)
        }

        return log
    }
}
