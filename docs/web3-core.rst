.. _web3-core:

.. include:: include_announcement.rst

===========
Core Module
===========

The ``Core Module`` does provide the ``AbstractWeb3Module`` to implement Web3 compatible modules.

.. _web3-module-abstract-module:

AbstractWeb3Module
==================

Source: `AbstractWeb3Module <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-core/src/AbstractWeb3Module.js>`_

The ``AbstractWeb3Module`` does have the following constructor parameters:

- ``provider`` - ``AbstractSocketProvider | HttpProvider | CustomProvider | String`` The provider class or string.
- ``options`` - ``Web3ModuleOptions`` These are the default ``options`` of a Web3 module. (optional)
- ``methodFactory`` - ``AbstractMethodFactory`` The :ref:`MethodFactory <web3-abstract-method-factory>` will be used in the module proxy for the JSON-RPC method calls. (optional)
- ``net`` - ``net.Socket`` The ``net.Socket`` object of the NodeJS net module. (optional)


Interface of the ``AbstractWeb3Module`` class:

.. include:: include_package-core.rst

------------------------------------------------------------------------------------------------------------------------

