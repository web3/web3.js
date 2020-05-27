.. _promiEvent:

=========================
Callbacks Promises Events
=========================

To help web3 integrate into all kind of projects with different standards we provide multiple ways to act on asynchronous functions.

Most web3.js objects allow a callback as the last parameter, as well as returning promises to chain functions.

Ethereum as a blockchain has different levels of finality and therefore needs to return multiple "stages" of an action.
To cope with requirement we return a "promiEvent" for functions like ``web3.eth.sendTransaction`` or contract methods.
This "promiEvent" is a promise combined with an event emitter to allow acting on different stages of action on the blockchain, like a transaction.

PromiEvents work like a normal promises with added ``on``, ``once`` and ``off`` functions.
This way developers can watch for additional events like on "receipt" or "transactionHash".

.. code-block:: javascript

    web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
    .once('transactionHash', function(hash){ ... })
    .once('receipt', function(receipt){ ... })
    .on('confirmation', function(confNumber, receipt){ ... })
    .on('error', function(error){ ... })
    .then(function(receipt){
        // will be fired once the receipt is mined
    });
