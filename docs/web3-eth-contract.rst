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

``Object`` - jsonInterface: The json interface for the contract to instantiate
``String`` - address (optional): The address of the smart contract to call, can be added later using `myContract.address = '0x1234..'`
``Object`` - options (optional): The fallback options used for calls and transactions made to this contract.
    * ``String`` - from: The address transactions should be made from.
    * ``String`` - gasPrice: The gas price in wei to use for transactions.
    * ``Number`` - gas: The maximum gas provided for a transaction (gas limit).

-------
Returns
-------

``Object``: The contract instance with all its methods and events.

-------
Example
-------

.. code-block:: javascript

    var myContract = new web3.eth.contract([...], '0x1234....', {
        from: '0x1234' // default from address
        gasPrice: '20000000000000' // default gas price in wei
    });


------------------------------------------------------------------------------
