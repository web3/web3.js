.. _eth-contract:

========
web3.eth.contract
========

The ``web3.eth.contract`` object makes it easy to interact with smart contracts on the ethereum blockchain.
When you create a new contract object you give it the json interface of the respective smart contract
and web3 will auto convert all calls into low level ABI calls over RPC for you.

This allows you to interact with smart contracts as if they were JavaScript objects.

------------------------------------------------------------------------------

contract
=====================

.. index:: json interface

.. code-block:: javascript

    web3.eth.contract(jsonInterface[, address][, options])

Creates a new contract instance with all its methods and events defined in its :ref:`json interface <json-interface>` object.

----------
Parameters
----------

``Object`` - a valid provider with at least ``send``, ``on`` function

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
