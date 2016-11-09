========
web3.utils
========

This package provides utility functions for ethereum dapps and other web3.js packages.


------------------------------------------------------------------------------

sha3
=====================

.. code-block:: javascript

    web3.utils.sha3(myProvider)

When called changes the current provider for all modules.

----------
Parameters
----------

1. ``Object`` - myProvider : a valid provider with at least ``send``, ``on`` function

-------
Returns
-------

``undefined``

-------
Example
-------

.. code-block:: javascript

    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


------------------------------------------------------------------------------
