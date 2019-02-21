.. _web3-module-contract:

.. include:: include_announcement.rst

========================
Web3 Contract Module API
========================

The Web3 eth-contract module does provide the ``AbstractContract`` for customizing the behavior and the ``Contract`` class
for simply create ``Contract`` classes without using ``web3.eth.Contract``.
Checkout the starter module for further information about "how to use the ``Contract`` object"

.. _web3-module-abstract-contract:

AbstractContract
================

Source: `AbstractContract <https://github.com/ethereum/web3.js/tree/1.0/packages/web3-eth-contract/src/AbstractContract.js>`_

The ``AbstractContract`` class does extend from the ``AbstractWeb3Module`` and has the following constructor parameters:

- ``provider`` - The provider class or string.
- ``providersModuleFactory`` - The ``ProvidersModuleFactory`` class which will be used to resolve the provider in the constructor.
- ``methodModuleFactory`` - The ``MethodModuleFactory`` class is optional and will just be used if the ``MethodFactory`` is given.
- ``ContractModuleFactory`` - The ``ContractModuleFactory`` class.
- ``PromiEvent`` - The ``PromiEvent`` reference.
- ``abiCoder`` - The ``AbiCoder`` class.
- ``utils`` - The ``utils`` object which will be used for the methods.
- ``formatters`` - The ``formatters`` object which will be used for the methods.
- ``abi`` - The ``abi`` of the contract.
- ``address`` - The contract ``address`` if known.
- ``options`` - The default ``options`` for a contract.

Further details about which methods and properties are available can be seen in the :ref:`web3-eth-contract <web3-eth-contract>` documentation.

------------------------------------------------------------------------------------------------------------------------

