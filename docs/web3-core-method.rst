.. _web3-core-method:

.. include:: include_announcement.rst

==================
Core Method Module
==================

The ``Core Method Module`` does provide all method classes and the abstract method factory which will be used in the ``AbstractWeb3Module``.

.. _web3-abstract-method-factory:


AbstractMethodFactory
=====================

Source: `AbstractMethodFactory <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/factories/AbstractMethodFactory.js>`_

The ``AbstractMethodFactory`` does have the following constructor parameters:

- ``utils`` - ``Utils`` The ``Utils`` object from the ``web3-utils`` module.
- ``formatters`` - ``Object`` The formatters object from the ``web3-core-helpers`` module.

-------
Example
-------

.. code-block:: javascript

    import {
        AbstractMethodFactory,
        GetBlockByNumberMethod,
        ListeningMethod,
        PeerCountMethod,
        VersionMethod
    } from 'web3-core-method';

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
                getId: VersionMethod,
                getBlockByNumber: GetBlockByNumberMethod,
                isListening: ListeningMethod,
                getPeerCount: PeerCountMethod
            };
        }
    }


------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-method:


AbstractMethod
==============

Source: `AbstractMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractMethod.js>`_

Because we are always adding new JSON-RPC method do we just link the methods folder as resource.

Source: `Methods <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/src/methods/>`_

The provided method classes do have the following interface:

The ``AbstractMethod`` class does have the following constructor parameters:

- ``rpcMethod`` - ``String`` The JSON-RPC method name.
- ``parametersAmount`` - ``Number`` The amount of parameters this JSON-RPC method has.
- ``utils`` - ``Utils``
- ``formatters`` - ``Object`` The formatters object.
- ``moduleInstance`` - ``AbstractWeb3Module``

The ``AbstractMethod`` class is the base JSON-RPC method class and does provide the basic methods and properties for creating a
Web3.js compatible JSON-RPC method.

You're able to overwrite these methods:

- :ref:`execute(): PromiEvent <web3-abstract-method-execute>`
- :ref:`afterExecution(response: any): void <web3-abstract-method-after-execution>`
- :ref:`beforeExecution(moduleInstance: AbstractWeb3Module): void <web3-abstract-method-before-execution>`
- :ref:`setArguments(arguments: IArguments): void <web3-abstract-method-set-arguments>`
- :ref:`getArguments(arguments: IArguments): {parameters: any[], callback: Function} <web3-abstract-method-get-arguments>`


This example will show the usage of the ``setArguments(arguments: IArguments)`` method.

It's also possible to set the parameters and callback method directly over the ``parameters`` and ``callback`` property
of the method class.

-------
Example
-------

.. code-block:: javascript

    class Example extends AbstractWeb3Module {
        constructor(...) {
            // ...
        }

        sign() {
            const method = new AbstractMethod('eth_sign', 2, utils, formatters, this);
            method.setArguments(arguments)

            return method.execute();
        }
    }

    const example = new Example(...);

    const response = await example.sign('0x0', 'message').
    // > "response"


    example.sign('0x0', 'message', (error, response) => {
        console.log(response);
    };
    // > "response"


------------------------------------------------------------------------------------------------------------------------


The ``AbstractMethod`` class interface:

.. include:: include_web3-module-abstract-method-class-reference.rst


------------------------------------------------------------------------------------------------------------------------


.. _web3-module-abstract-send-method:


AbstractObservedTransactionMethod
=================================

Source: `AbstractObservedTransactionMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/transaction/AbstractObservedTransactionMethod.js>`_

The ``AbstractObservedTransactionMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - ``String`` The JSON-RPC method name.
- ``parametersAmount`` - ``Number`` The amount of parameters this JSON-RPC method has.
- ``utils`` - ``Object`` The Utils object.
- ``formatters`` - ``Object`` The formatters object.
- ``transactionObserver`` - ``TransactionObserver`` The ``TransactionObserver`` class which defines the confirmation process of the transaction.

The ``AbstractObservedTransactionMethod`` is the base method class for all "send transaction" methods.

Abstract methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: include_web3-module-abstract-method-class-reference.rst

------------------------------------------------------------------------------------------------------------------------
