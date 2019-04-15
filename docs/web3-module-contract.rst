.. _web3-module-contract:

.. include:: include_announcement.rst

========================
Web3 Contract Module API
========================

The Web3 Contract Module API does provide to possibility to create project specific contracts with pre-injecting of the ABI
or customizing of the default behaviour of a Web3 contract.

.. _web3-module-contract:

Contract
========

The exported class ``Contract`` is here to simply pre-inject a contract ABI.


----------
Parameters
----------

1. ``provider`` - ``Object|String``: A Web3.js provider.
1. ``abi`` - ``Array``: Contract ABI
1. ``accounts`` - `` :ref:`Accounts <eth-accounts>```
1. ``options`` - ``Web3ModuleOptions``


-------
Example
-------

.. code-block:: javascript

    import {MyABI, options} from '../folder/file.js';
    import {Accounts} from 'web3-eth-accounts';

    export class MyContract extends Contract {
        constructor(provider) {
            super(provider, MyAbi, new Accounts(...), '0x0', options);
        }
    }



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


-------
Example
-------

.. code-block:: javascript

    export class MyContract extends AbstractContract {
     ....
    }



------------------------------------------------------------------------------------------------------------------------

