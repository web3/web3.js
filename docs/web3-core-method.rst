.. _web3-core-method:

.. include:: include_announcement.rst

=======================
Web3 Core Method Module
=======================

The Web3 Core Method Module does provide all method classes and the abstract method factory which will be used in the ``AbstractWeb3Module``.

.. _web3-abstract-method-factory:


AbstractMethodFactory
=====================

Source: `AbstractMethodFactory <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/factories/AbstractMethodFactory.js>`_

The ``AbstractMethodFactory`` does have the following constructor parameters:

- ``methodModuleFactory`` - The module factory of the web3-core-method module.
- ``utils`` - The Utils object from the web3-utils module.
- ``formatters`` - The formatters object from the web3-core-helpers module.

------------------------------------------------------------------------------------------------------------------------

Methods
=======

Source: `Methods <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/src/methods/>`_

Because we are always adding new JSON-RPC method do we just link the methods folder as resource.

The provided method classes do have the following interface:

.. _web3-module-abstract-method:

AbstractMethod
==============

Source: `AbstractMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractMethod.js>`_

The ``AbstractMethod`` does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethod`` is the base method class and does provide the basic methods and properties for creating a
Web3.js compatible JSON-RPC method.

You're able to overwrite these methods:

- :ref:`execute <web3-abstract-method-execute>`
- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

Usage Example
*************

This example will show the usage of the ``arguments`` property.

It's also possible to set the parameters and callback method directly over the ``parameters`` and ``callback`` property
of the method class.

.. code-block:: javascript

    class Example extends AbstractWeb3Module {
        constructor(...) {
            ...
        }

        myMethod() {
            const method new MyCustomMethod(...);
            method.arguments = arguments

            return method.execute(this);
        }
    }

    const example = new Example(...);

    const response = await example.myMethod('parameter').
    // > "result"


    example.myMethod('parameters', (error, response) => {
        console.log(response);
    };
    // > "result"



The ``AbstractMethod`` class does have the following methods and properties:

.. include:: include_web3-module-abstract-method-class-reference.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-call-method:

AbstractCallMethod
==================

Source: `AbstractCallMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractCallMethod.js>`_

The ``AbstractCallMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractCallMethod`` is the base method class for all methods expect the "send transaction" methods.

**Don't overwrite the ``execute`` method of the ``AbstractCallMethod`` class.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: include_web3-module-abstract-method-class-reference.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-send-method:

AbstractSendMethod
==================

Source: `AbstractSendMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractSendMethod.js>`_

The ``AbstractSendMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.
- ``tranactionConfirmationWorkflow`` - The ``TransactionConfirmationWorkflow`` class which defines the confirmation process of the transaction.

The ``AbstractSendMethod`` is the base method class for all "send transaction" methods.

**Don't overwrite the ``execute`` method of the ``AbstractSendMethod`` class.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: include_web3-module-abstract-method-class-reference.rst

------------------------------------------------------------------------------------------------------------------------
