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
- ``providersModuleFactory`` - The ``ProvidersModuleFactory`` which will be used to resolve the provider in the constructor.
- ``methodModuleFactory`` - The ``MethodModuleFactory`` is optional and will just be used if the ``MethodFactory`` is given.
- ``methodFactory`` - The ``MethodFactory`` is only required if you extend the module with methods.
- ``options`` - These are the default ``options`` of a Web3 module.


If you would like to support the latest features of Web3.js and also provide the same API for your module then please pass
the ``methodModuleFactory`` and the ``methodFactory`` parameter for extending the module with your methods.

The parameters ``methodModuleFactory`` and ``methodFactory`` aren't required if you providing your own way to interact with a Web3 method.

These are the available methods and properties the AbstractWeb3Module does provide:

.. include:: include_package-core.rst

------------------------------------------------------------------------------------------------------------------------

