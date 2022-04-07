
===============
Getting Started
===============

The web3.js library is a collection of modules that contain functionality for the ethereum ecosystem.

- ``web3-eth`` is for the ethereum blockchain and smart contracts.
- ``web3-shh`` is for the whisper protocol, to communicate p2p and broadcast.
- ``web3-bzz`` is for the swarm protocol, the decentralized file storage.
- ``web3-utils`` contains useful helper functions for Dapp developers.


.. _adding-web3:

Adding web3.js
==============

.. index:: npm
.. index:: yarn

First you need to get web3.js into your project. This can be done using the following methods:

- npm: ``npm install web3``
- yarn: ``yarn add web3``
- pure js: link the ``dist/web3.min.js``

After that you need to create a web3 instance and set a provider.

Most Ethereum-supported browsers like MetaMask have an `EIP-1193 <https://eips.ethereum.org/EIPS/eip-1193>`_ compliant provider available at ``window.ethereum``.

For web3.js, check ``Web3.givenProvider``.

If this property is ``null`` you should connect to a remote/local node.

.. code-block:: javascript

    // In Node.js use: const Web3 = require('web3');

    const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

That's it! now you can use the ``web3`` object.
