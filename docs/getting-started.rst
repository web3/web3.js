
###############
Getting Started
###############

The web3.js library is a collection of modules which contain specific functionality for the ethereum ecosystem.

- The ``web3-eth`` library contains functions related to the ethereum blockchain and smart contracts
- The ``web3-net`` library contains functions related to the network connection and peers
- The ``web3-shh`` library contains functions related to the whisper protocol for p2p communication
- The ``web3-bzz`` library contains functions related to the swarm protocol for decentralized file storage
- The ``web3-personal`` library contains functions related ethereum account management

The following page will describe how to install and add web3.js to your project.
You can find some extra examples in the :ref:`API-reference <api-reference>` and the `examples here <https://github.com/ethereum/web3.js/tree/master/examples>`_.

Please also check out these `useful patterns <https://github.com/ethereum/wiki/wiki/Useful-Ðapp-Patterns>`_ for building Ðapp.


.. _adding-web3:

Adding web3.js
**************

.. index:: npm
.. index:: bower
.. index:: meteor

First you need to get web3.js into your project. This can be done using the following methods:

- npm: ``npm install web3``
- bower: ``bower install web3``
- meteor: ``meteor add ethereum:web3``
- vanilla: ``link the dist./web3.min.js``

After that you need to create a web3 instance, setting a provider. To make sure you don't overwrite the already set provider when in Mist.
Check first if the web3 object is available:

.. code-block:: javascript

    if (typeof web3 !== 'undefined') {
        web3 = new Web3(web3.currentProvider);
    } else {
        // set the provider you want from Web3.providers
        web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    }

Thats it! now you can use the API of the web3 object.
