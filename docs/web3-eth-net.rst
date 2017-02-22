.. _eth-net:

=========
web3.eth.net
=========


Contains functions to receive information about the current network.


------------------------------------------------------------------------------

id
=========

.. code-block:: javascript

    web3.eth.net.getId([callback])

Gets the current network ID.

----------
Parameters
----------

none

-------
Returns
-------

``Promise`` returns ``Number``: The network ID.

-------
Example
-------

.. code-block:: javascript

    web3.eth.getId()
    .then(console.log);
    > 1

------------------------------------------------------------------------------

getNetworkType
=====================

.. code-block:: javascript

    web3.eth.net.getNetworkType([callback])

Guesses the chain the node is connected by comparing the genesis hashes.

.. note:: This is not a 100% accurate guess as any private network could use testnet and mainnet genesis blocks and network IDs.

-------
Returns
-------

``Promise`` returns ``String``:
    - ``"main"`` for main network
    - ``"morden"`` for the morden test network
    - ``"ropsten"`` for the morden test network
    - ``"private"`` for un deteacable networks.


-------
Example
-------

.. code-block:: javascript

    web3.eth.net.getNetworkType()
    .then(console.log);
    > "main"


------------------------------------------------------------------------------

isListening
=========

.. code-block:: javascript

    web3.eth.net.isListening([callback])

Checks if the node is listening for peers.

----------
Parameters
----------

none

-------
Returns
-------

``Promise`` returns ``Boolean``

-------
Example
-------

.. code-block:: javascript

    web3.eth.isListening()
    .then(console.log);
    > true

------------------------------------------------------------------------------

getPeerCount
=========

.. code-block:: javascript

    web3.eth.net.getPeerCount([callback])

Get the number of peers connected to.

----------
Parameters
----------

none

-------
Returns
-------

``Promise`` returns ``Number``

-------
Example
-------

.. code-block:: javascript

    web3.eth.getPeerCount()
    .then(console.log);
    > 25
