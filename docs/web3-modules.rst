.. _web3-modules:

.. include:: include_announcement.rst

================
 Web3 Module API
================

The Web3 Module API provides you the possibility to create your own custom Web3 Module with JSON-RPC methods, subscriptions
or contracts. The provided modules from the Web3 library are also written with the Web3 Module API the core does provide.

The idea of the Web3 Module API is to extend and customize the JSON-RPC methods, contracts and subscriptions to project
specific functions with a similar kind of API the DApp developer knows from the Web3.js library. It should be possible
to create complex contract API's and tools for the development of a DApp.

------------------------------------------------------------------------------------------------------------------------

=================
 Getting Started
================

Setup
=====

First clone the web3-examples github repository and copy the following `starter folder https://github.com/ethereum/web3-examples/tree/development/modules/starter-module`_

If you successfully created your folder with the starter files then run ```npm install`` and ``npm run build``.
This will install all required dependencies and builds the module in the dev mode.

These example objects are contained in the start-module:

- :ref:`StarterModule <web3-starter-module>`
- :ref:`StarterModuleMethodFactory <web3-starter-module-method-factory>`
- :ref:`StarterMethod <web3-starter-method>`
- :ref:`StarterContract <web3-starter-contract>`
- :ref:`StarterSubscription <web3-starter-subscription>`

------------------------------------------------------------------------------------------------------------------------

.. _web3-starter-module:

StarterModule
=============

The ``StarterModule`` class it self contains all the custom methods and subscriptions.

AbstractWeb3Module
******************

The ``AbstractWeb3Module`` does have the following constructor parameters:

- ``provider: `` - The provider object or string.
- ``providersModuleFactory: `` - The ProvidersModuleFactory which will be used for resolving providers when ``setProvider()`` is executed and also for the constructor.
- ``methodModuleFactory?: `` - The MethodModuleFactory is optional and will just be used if the MethodFactory also is given.
- ``methodFactory?: `` - The MethodFactory is optional an will just be used if you would like to extend the module with methods.
- ``options?: `` - These are the default ``options``.


If you would like to provide the same method API as the Web3.js library is providing and also supporting the latest features of the library.
Should you pass the ``methodModuleFactory``and the ``methodFactory`` parameter for extending the module with the methods.

If you would like to provide your own API for interacting with a JSON-RPC method then you can simply use the method in
the module without the ``MethodModuleFactory`` and ``MethodFactory`` constructor parameter.

The example code of the starter module is placed in the ``<project-root-dir>/src/`` folder with the name ``StarterModule``.


