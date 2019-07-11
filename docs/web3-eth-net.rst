.. _eth-net:

=========
web3.eth.net
=========


Contains functions to receive information about the current network.


------------------------------------------------------------------------------


.. include:: include_package-net.rst


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
    - ``"private"`` for undetectable networks.


-------
Example
-------

.. code-block:: javascript

    web3.eth.net.getNetworkType()
    .then(console.log);
    > "main"


