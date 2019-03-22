.. _web3-core:

.. include:: include_announcement.rst

================
Web3 Core Module
================

The Web3 Core Module does provide the ``AbstractWeb3Module`` which will be used for creating a Web3 compatible module.

.. _web3-module-abstract-module:

AbstractWeb3Module
==================

Source: `AbstractWeb3Module <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core-method/lib/methods/AbstractWeb3Module.js>`_

The ``AbstractWeb3Module`` does have the following constructor parameters:

- ``provider`` - The provider class or string.
- ``options`` - These are the default ``options`` of a Web3 module. (optional)
- ``methodFactory`` - The ``MethodFactory`` is only required if you extend the module with methods. (optional)
- ``net`` - The ``net.Socket`` object of the NodeJS net module. (optional)


If you would like to support the latest features of Web3.js and also provide the same API for your module then please pass
the ``methodFactory`` class for extending the module with your methods.

These are the available methods and properties the AbstractWeb3Module does provide:

.. include:: include_package-core.rst

------------------------------------------------------------------------------------------------------------------------

