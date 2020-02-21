
===============
Getting Started
===============

The web3.js library is a collection of modules which contain specific functionality for the ethereum ecosystem.

- The ``web3-eth`` is for the ethereum blockchain and smart contracts
- The ``web3-shh`` is for the whisper protocol to communicate p2p and broadcast
- The ``web3-bzz`` is for the swarm protocol, the decentralized file storage
- The ``web3-utils`` contains useful helper functions for Dapp developers.


.. _adding-web3:

Adding web3.js
==============

.. index:: npm
.. index:: bower
.. index:: meteor

First you need to get web3.js into your project. This can be done using the following methods:

- npm: ``npm install web3``
- meteor: ``meteor add ethereum:web3``
- pure js: link the ``dist/web3.min.js``

After that you need to create a web3 instance and set a provider.
Ethereum supported Browsers like Mist or MetaMask will have a ``ethereumProvider`` or ``ethereum``
or ``web3.currentProvider`` available. For  web3.js, check ``Web3.givenProvider``.
If this property is ``null`` you should connect to a remote/local node.

.. code-block:: javascript

    // in node.js use: var Web3 = require('web3');

    var web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");

That's it! now you can use the ``web3`` object.
