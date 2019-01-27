.. _web3-modules:

.. include:: include_announcement.rst

===============
Web3 Module API
===============

The Web3 Module API gives you the possibility to create your own custom Web3 Module with JSON-RPC methods, subscriptions
or contracts. The provided modules from the Web3 library are also written with the Web3 Module API the core does provide.

The idea of the Web3 Module API is to extend and customize the JSON-RPC methods, contracts and subscriptions to project
specific functions with a similar kind of API the DApp developer knows from the Web3.js library. It should be possible
to create complex contract APIs and tools for the development of a DApp.

These Web3 Module API provides the following ES6 classes:

- :ref:`AbstractWeb3Module <web3-abtract-module>`
- :ref:`AbstractMethodFactory <web3-abtract-method-factory>`
- :ref:`AbstractMethod <web3-abstract-method>`
- :ref:`AbstractCallMethod <web3-abstract-call-method>`
- :ref:`AbstractSendMethod <web3-abstract-send-method>`

------------------------------------------------------------------------------------------------------------------------

=======
Example
=======

Clone the ``web3-examples`` GitHub repository and copy the following `starter folder: https://github.com/ethereum/web3-examples/tree/development/modules/starter-module`_

If you successfully copied the files in your folder then run ```npm install`` and ``npm run build``.
This will install all required dependencies and builds the module with the ``development`` flag.
You can find further information to the development environment in the readme file of the example folder.

These example ES6 classes are included:

- :ref:`StarterModule <>`_
- :ref:`StarterModuleMethodFactory <>`_
- :ref:`StarterMethod <>`_
- :ref:`StarterContract <>`_
- :ref:`StarterSubscription <>`_

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-module:

AbstractWeb3Module
==================

Source: `AbstractWeb3Module <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractWeb3Module.js>`_

The ``AbstractWeb3Module`` does have the following constructor parameters:

- ``provider`` - The provider class or string.
- ``providersModuleFactory`` - The ``ProvidersModuleFactory`` which will be used to resolve the providers when ``setProvider()`` is executed or in the constructor.
- ``methodModuleFactory`` - The ``MethodModuleFactory`` is optional and will just be used if the ``MethodFactory`` is given.
- ``methodFactory`` - The ``MethodFactory`` is optional an is required to extend the module with methods.
- ``options`` - These are the default ``options``.


If you would like to support the latest features of Web3.js and to provide the same API for your module then please pass
the ``methodModuleFactory`` and the ``methodFactory`` parameter for extending the module with the defined methods.

The parameters ``methodModuleFactory`` and ``methodFactory`` aren't required if you providing your own way to interact with a Web3 method.

These are the available methods and properties the AbstractWeb3Module does provide:

.. include:: include_package-core.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-factory:

AbstractMethodFactory
=====================

Source: `AbstractMethodFactory <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractMethodFactory.js>`_

The ``AbstractMethodFactory`` does have the following constructor parameters:

- ``methodModuleFacotry`` - The MethodModuleFactory.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethodFactory`` class wil be used in the ``MethodProxy`` of the current module for creating the correct method.
This is the right place to pass additional parameters to a custom method class. Just extend the ``createMethod()`` of
the ``AbstractMethodFactory`` and you're able to pass additional parameters to the constructor of your custom method.

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-method:

AbstractMethod
==============

Source: `AbstractMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractMethod.js>`_

The ``AbstractMethod`` does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethod`` is the base method object and does provide the basic functionalities and methods to create a
Web3.js compatible custom JSON-RPC method.

**The ``execute`` method of the ``AbstractMethod`` class has to get overwritten.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

Usage Example
*************

This example will show the usage of the ``arguments`` property.
It's also possible to set the parameters and callback method directly over the ``parameters`` and ``callback`` property
of the method class.

.. code-block:: javascript

    class Example extend AbstractWeb3Module {
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
    > "result"


    example.myMethod('parameters', (error, response) => {
        console.log(response);
    };
    > "result"

The AbstractMethod object does have the following methods and properties:

.. include:: web3-module-abstract-method-class-reference.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-call-method:

AbstractCallMethod
==============

Source: `AbstractCallMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractCallMethod.js>`_

The ``AbstractCallMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractCallMethod`` is the base method object for all methods expect the "send transaction" methods.

**Don't overwrite the ``execute`` method of the ``AbstractCallMethod`` class.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: web3-module-abstract-method-class-reference.rst


------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-send-method:

AbstractSendMethod
==============

Source: `AbstractSendMethod <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractSendMethod.js>`_

The ``AbstractSendMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.
- ``tranactionConfirmationWorkflow`` - The ``TransactionConfirmationWorkflow`` class which defines the confirmation process of the transaction.

The ``AbstractSendMethod`` is the base method object for all "send transaction" methods.

**Don't overwrite the ``execute`` method of the ``AbstractSendMethod`` class.**

You're able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: web3-module-abstract-method-class-reference.rst
