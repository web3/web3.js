###############
Callbacks Promises Events
###############

To help web3 integrate into all kind of projects with different standards
we provide multiple ways to act on asynchronous functions.

Most web3.js objects allow a callback as the last parameter, as well as return a promise to chain funcitons.

Ethereum as a blockchain has different level of finality and therefore we return for some functions,
like ``web3.eth.sendTransaction`` or contract methods a "promiEvent". This is a promise combined with an event emitter.

This promiEvent works like a normal promise with added ``on`` functions to watch for additional events like "receipt" or "transactionHash"

.. code-block:: javascript

    web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
    .on('transactionHash', function(hash){ ... })
    .on('receipt', function(receipt){ ... })
    .then(function(receipt){
        // will be fired once the receipt its mined
    });
