.. _web3-modules:

.. include:: include_announcement.rst

==========
Module API
==========

The ``Module API`` gives you the possibility to create your **own custom Web3 Module** with JSON-RPC methods, subscriptions, or contracts.
The provided modules from the Web3 library are also written with the ``Module API`` the core does provide.

The goal of the ``Module API`` is to provide the possibility to extend and customize the JSON-RPC methods, contracts, and subscriptions
to project specific classes with a similar kind of API the DApp developer knows from the Web3.js library.
It's possible with the Web3 Module API to create complex contract APIs and tools for the development of a DApp.

These are the core modules which are providing all the classes for the Web3 Module API.

- :ref:`web3-core <web3-core>`
- :ref:`web3-core-method <web3-core-method>`
- :ref:`web3-core-subscriptions <web3-core-subscriptions>`
- :ref:`Contract <web3-module-contract>`

-------
Example
-------

.. code-block:: javascript

    import * as Utils from 'web3-utils';
    import {formatters} from 'web3-core-formatters';
    import {AbstractWeb3Module} from 'web3-core';
    import {AbstractMethodFactory, GetBlockByNumberMethod, AbstractMethod} from 'web3-core-method';

    class MethodFactory extends AbstractMethodFactory {
        /**
         * @param {Utils} utils
         * @param {Object} formatters
         *
         * @constructor
         */
        constructor(utils, formatters) {
            super(utils, formatters);

            this.methods = {
                getBlockByNumber: GetBlockByNumberMethod
            };
        }
    }

    class Example extends AbstractWeb3Module {
        /**
         * @param {AbstractSocketProvider|HttpProvider|CustomProvider|String} provider
         * @param {Web3ModuleOptions} options
         * @param {Net.Socket} net
         *
         * @constructor
         */
        constructor(provider, net, options) {
            super(provider, net, new MethodFactory(Utils, formatters), options;
        }

        /**
         * Executes the eth_sign JSON-RPC method
         *
         * @method sign
         *
         * @returns {Promise}
         */
        sign() {
            const method = new AbstractMethod('eth_sign', 2, Utils, formatters, this);
            method.setArguments(arguments)

            return method.execute();
        }

        /**
         * Executes the eth_subscribe JSON-RPC method with the subscription type logs
         *
         * @method logs
         *
         * @returns {LogSubscription}
         */
        logs(options) {
            return new LogSubscription(
              options,
              Utils,
              formatters,
              this,
              new GetPastLogsMethod(Utils, formatters, this)
            );
        }
    }

    const example = new Example(provider, net, options);

    example.sign('0x0', 'message').then(console.log);
    // > "response"

    example.sign('0x0', 'message', (error, response) => {
        console.log(response);
    };
    // > "response"

    const block = example.getBlockByNumber(1).then(console.log);
    // > {}

    example.logs(options).subscribe(console.log);
    > {}

