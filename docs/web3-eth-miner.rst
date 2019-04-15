.. _eth-miner:

.. include:: include_announcement.rst

==============
web3.eth.miner
==============


The ``web3-eth-miner`` package allows you to remote control the node's mining operation and set various mining specific settings.


.. code-block:: javascript

    import {Miner} from 'web3-eth-miner';

    // "Web3.givenProvider" will be set if in an Ethereum supported browser.
    const miner = new Miner(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


------------------------------------------------------------------------------


.. include:: include_package-core.rst



------------------------------------------------------------------------------


setExtra
========

.. code-block:: javascript

    web3.eth.miner.setExtra(extraData, [, callback])

This method allows miner to set extra data during mining the block.

----------
Parameters
----------

1. ``extraData`` - ``String``: Extra data which is to be set.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``Promise<boolean>`` - True if successful.

-------
Example
-------

.. code-block:: javascript

    web3.eth.miner.setExtra('Hello').then(console.log);
    > true

------------------------------------------------------------------------------


setGasPrice
===========

.. code-block:: javascript

    web3.eth.miner.setGasPrice(gasPrice, [, callback])

This method allows to set minimal accepted gas price during mining transactions. Any transactions that are below this limit will get excluded from the mining process.

----------
Parameters
----------


1. ``number | hex`` - Gas price.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - True if successful.


-------
Example
-------


.. code-block:: javascript

    web3.eth.miner.setGasPrice("0x4a817c800").then(console.log);
    > true

    web3.eth.miner.setGasPrice(20000000000).then(console.log);
    > true


------------------------------------------------------------------------------


setEtherBase
============

.. code-block:: javascript

    web3.eth.miner.setEtherBase(address, [, callback])

Sets etherbase, where mining reward will go.

----------
Parameters
----------


1. ``String`` - address where mining reward will go.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - True if successful.


-------
Example
-------


.. code-block:: javascript

    web3.eth.miner.setEtherBase("0x3d80b31a78c30fc628f20b2c89d7ddbf6e53cedc").then(console.log);
    > true

------------------------------------------------------------------------------


start
=====

.. code-block:: javascript

    web3.eth.miner.start(miningThread, [, callback])

Start the CPU mining process with the given number of threads.

----------
Parameters
----------


1. ``hex | number`` - Mining threads.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - True if successful.


-------
Example
-------


.. code-block:: javascript

    web3.eth.miner.start('0x1').then(console.log);
    > true

    web3.eth.miner.start(1).then(console.log);
    > true

------------------------------------------------------------------------------


stop
====

.. code-block:: javascript

    web3.eth.miner.stop([callback])

Stop the CPU mining process.

----------
Parameters
----------


1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - True if successful.


-------
Example
-------


.. code-block:: javascript

    web3.eth.miner.stop().then(console.log);
    > true

------------------------------------------------------------------------------