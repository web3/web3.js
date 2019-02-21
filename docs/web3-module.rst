.. _web3-modules:

.. include:: include_announcement.rst

===============
Web3 Module API
===============

The Web3 Module API gives you the possibility to create your own custom Web3 Module with JSON-RPC methods, subscriptions
or contracts. The provided modules from the Web3 library are also written with the Web3 Module API the core does provide.

The goal of the Web3 Module API is to provide the possibility to extend and customize the JSON-RPC methods, contracts and subscriptions
to project specific classes with a similar kind of API the DApp developer knows from the Web3.js library.
It's possible with the Web3 Module API to create complex contract APIs and tools for the development of a DApp.


==============
Module Example
==============

Clone the ``web3-examples`` GitHub repository and copy the following `starter folder: <https://github.com/ethereum/web3-examples/tree/development/modules/starter-module>`_

If you moved the files in your folder then run ``npm install`` and ``npm run build``.
This will install all required dependencies and builds the module with the ``development`` flag.
You can find further information to the development environment in the readme file of the example folder.

These ES6 classes are included in the example folder:

- ``StarterModule``
- ``StarterModuleMethodFactory``
- ``StarterMethod``
- ``StarterContract``
- ``StarterSubscription``

================
Modules API
================

These are the core modules which are providing all the classes for the Web3 Module API.

- :ref:`web3-core <web3-core>`
- :ref:`web3-core-method <web3-core-method>`
- :ref:`web3-core-subscriptions <web3-core-subscriptions>`
- :ref:`Contract <web3-module-contract>`

