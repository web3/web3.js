.. _web3-modules:

.. include:: include_announcement.rst

===============
Web3 Module API
===============

The Web3 Module API provides you the possibility to create your own custom Web3 Module with JSON-RPC methods, subscriptions
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

.. _web3-abstract-module:

AbstractWeb3Module
==================

Source:

The ``AbstractWeb3Module`` does have the following constructor parameters:

- ``provider`` - The provider object or string.
- ``providersModuleFactory`` - The ProvidersModuleFactory which will be used for resolving providers when ``setProvider()`` is executed and also for the constructor.
- ``methodModuleFactory`` - The MethodModuleFactory is optional and will just be used if the MethodFactory also is given.
- ``methodFactory`` - The MethodFactory is optional an will just be used if you would like to extend the module with methods.
- ``options`` - These are the default ``options``.


If you would like to provide the same method API as the Web3.js library is providing and also supporting the latest features of the library.
Should you pass the ``methodModuleFactory`` and the ``methodFactory`` parameter for extending the module with the methods.

If you would like to provide your own API for interacting with a JSON-RPC method then you can simply use the method in
the module without the ``MethodModuleFactory`` and ``MethodFactory`` constructor parameter.

These are the available methods and properties the AbstractWeb3Module does provid:


.. include:: include_package-core.rst

------------------------------------------------------------------------------------------------------------------------

.. _web3-abstract-method-factory:

AbstractMethodFactory
=====================

Source:

The ``AbstractMethodFactory`` does have the following constructor parameters:

- ``methodModuleFacotry`` - The MethodModuleFactory.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethodFactory`` class wil be used in the ``MethodProxy`` of the current module for creating the correct method.
This is the right place to pass additional paramters to a custom method class. Just extend the ``createMethod()`` of
the ``AbstractMethodFactory`` and you're able to pass additional parameters to the constructor of your custom method.

------------------------------------------------------------------------------------------------------------------------

.. _web3-module-abstract-method:

AbstractMethod
==============

Source:

The ``AbstractMethod`` does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractMethod`` is the base method object and does provide the basic functionalities and methods for creating a
Web3.js compatible custom JSON-RPC method.

**The ``execute`` method of the ``AbstractMethod`` class has to get overwritten.**

You are able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

Usage Example
*************

This example will show how the parameters handling is working in the ``MethodProxy`` and
how you can implement a your own way for interacting with a JSON-RPC method.

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

.. _web3-abstract-method:

AbstractCallMethod
==============

Source:

The ``AbstractCallMethod`` extends from the :ref:`AbstractMethod <web3-module-abstract-method` and
does have the following constructor parameters:

- ``rpcMethod`` - The JSON-RPC method name.
- ``parametersAmount`` - The amount of parameters this JSON-RPC method has.
- ``utils`` - The Utils object.
- ``formatters`` - The formatters object.

The ``AbstractCallMethod`` is the base method object for all methods expect the "send transaction" methods.

**The ``execute`` method of the ``AbstractMethod`` class has not to get overwritten.**

You are able to overwrite these methods:

- :ref:`afterExecution <web3-abstract-method-after-execution>`
- :ref:`beforeExecution <web3-abstract-method-before-execution>`

.. include:: web3-module-abstract-method-class-reference.rst


------------------------------------------------------------------------------------------------------------------------
