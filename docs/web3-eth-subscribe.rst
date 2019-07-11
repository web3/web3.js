.. _eth-subscribe:

=========
web3.eth.subscribe
=========

The ``web3.eth.subscribe`` function lets you subscribe to specific events in the blockchain.



subscribe
=====================

.. code-block:: javascript

    web3.eth.subscribe(type [, options] [, callback]);

----------
Parameters
----------

1. ``String`` - The subscription, you want to subscribe to.
2. ``Mixed`` - (optional) Optional additional parameters, depending on the subscription type.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription, and the subscription itself as 3 parameter.

.. _eth-subscription-return:

-------
Returns
-------

``EventEmitter`` - A Subscription instance

    - ``subscription.id``: The subscription id, used to identify and unsubscribing the subscription.
    - ``subscription.subscribe([callback])``: Can be used to re-subscribe with the same parameters.
    - ``subscription.unsubscribe([callback])``: Unsubscribes the subscription and returns `TRUE` in the callback if successfull.
    - ``subscription.arguments``: The subscription arguments, used when re-subscribing.
    - ``on("data")`` returns ``Object``: Fires on each incoming log with the log object as argument.
    - ``on("changed")`` returns ``Object``: Fires on each log which was removed from the blockchain. The log will have the additional property ``"removed: true"``.
    - ``on("error")`` returns ``Object``: Fires when an error in the subscription occurs.

----------------
Notification returns
----------------

- ``Mixed`` - depends on the subscription, see the different subscriptions for more.

-------
Example
-------

.. code-block:: javascript

    var subscription = web3.eth.subscribe('logs', {
        address: '0x123456..',
        topics: ['0x12345...']
    }, function(error, result){
        if (!error)
            console.log(result);
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });


------------------------------------------------------------------------------


clearSubscriptions
=====================

.. code-block:: javascript

    web3.eth.clearSubscriptions()

Resets subscriptions.

.. note:: This will not reset subscriptions from other packages like ``web3-shh``, as they use their own requestManager.

----------
Parameters
----------

1. ``Boolean``: If ``true`` it keeps the ``"syncing"`` subscription.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    web3.eth.subscribe('logs', {} ,function(){ ... });

    ...

    web3.eth.clearSubscriptions();


------------------------------------------------------------------------------


subscribe("pendingTransactions")
=====================

.. code-block:: javascript

    web3.eth.subscribe('pendingTransactions' [, callback]);

Subscribes to incoming pending transactions.

----------
Parameters
----------

1. ``String`` - ``"pendingTransactions"``, the type of the subscription.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

-------
Returns
-------

``EventEmitter``: An :ref:`subscription instance <eth-subscription-return>` as an event emitter with the following events:

- ``"data"`` returns ``String``: Fires on each incoming pending transaction and returns the transaction hash.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occurs.

----------------
Notification returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``String`` - Second parameter is the transaction hash.

-------
Example
-------


.. code-block:: javascript

    var subscription = web3.eth.subscribe('pendingTransactions', function(error, result){
        if (!error)
            console.log(result);
    })
    .on("data", function(transaction){
        console.log(transaction);
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });


------------------------------------------------------------------------------


subscribe("newBlockHeaders")
=====================

.. code-block:: javascript

    web3.eth.subscribe('newBlockHeaders' [, callback]);

Subscribes to incoming block headers. This can be used as timer to check for changes on the blockchain.

----------
Parameters
----------

1. ``String`` - ``"newBlockHeaders"``, the type of the subscription.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

-------
Returns
-------

``EventEmitter``: An :ref:`subscription instance <eth-subscription-return>` as an event emitter with the following events:

- ``"data"`` returns ``Object``: Fires on each incoming block header.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occurs.

The structure of a returned block header is as follows:

    - ``number`` - ``Number``: The block number. ``null`` when its pending block.
    - ``hash`` 32 Bytes - ``String``: Hash of the block. ``null`` when its pending block.
    - ``parentHash`` 32 Bytes - ``String``: Hash of the parent block.
    - ``nonce`` 8 Bytes - ``String``: Hash of the generated proof-of-work. ``null`` when its pending block.
    - ``sha3Uncles`` 32 Bytes - ``String``: SHA3 of the uncles data in the block.
    - ``logsBloom`` 256 Bytes - ``String``: The bloom filter for the logs of the block. ``null`` when its pending block.
    - ``transactionsRoot`` 32 Bytes - ``String``: The root of the transaction trie of the block
    - ``stateRoot`` 32 Bytes - ``String``: The root of the final state trie of the block.
    - ``receiptsRoot`` 32 Bytes - ``String``: The root of the receipts.
    - ``miner`` - ``String``: The address of the beneficiary to whom the mining rewards were given.
    - ``extraData`` - ``String``: The "extra data" field of this block.
    - ``gasLimit`` - ``Number``: The maximum gas allowed in this block.
    - ``gasUsed`` - ``Number``: The total used gas by all transactions in this block.
    - ``timestamp`` - ``Number``: The unix timestamp for when the block was collated.

----------------
Notification returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``Object`` - The block header object like above.

-------
Example
-------


.. code-block:: javascript

    var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
        if (!error) {
            console.log(result);

            return;
        }

        console.error(error);
    })
    .on("data", function(blockHeader){
        console.log(blockHeader);
    })
    .on("error", console.error);

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if (success) {
            console.log('Successfully unsubscribed!');
        }
    });

------------------------------------------------------------------------------


subscribe("syncing")
=====================

.. code-block:: javascript

    web3.eth.subscribe('syncing' [, callback]);

Subscribe to syncing events. This will return an object when the node is syncing and when its finished syncing will return ``FALSE``.

----------
Parameters
----------

1. ``String`` - ``"syncing"``, the type of the subscription.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

-------
Returns
-------

``EventEmitter``: An :ref:`subscription instance <eth-subscription-return>` as an event emitter with the following events:

- ``"data"`` returns ``Object``: Fires on each incoming sync object as argument.
- ``"changed"`` returns ``Object``: Fires when the synchronisation is started with ``true`` and when finished with ``false``.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occurs.

For the structure of a returned event ``Object`` see :ref:`web3.eth.isSyncing return values <eth-issyncing-return>`.

----------------
Notification returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``Object|Boolean`` - The syncing object, when started it will return ``true`` once or when finished it will return `false` once.

-------
Example
-------


.. code-block:: javascript

    var subscription = web3.eth.subscribe('syncing', function(error, sync){
        if (!error)
            console.log(sync);
    })
    .on("data", function(sync){
        // show some syncing stats
    })
    .on("changed", function(isSyncing){
        if(isSyncing) {
            // stop app operation
        } else {
            // regain app operation
        }
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });

------------------------------------------------------------------------------


subscribe("logs")
=====================

.. code-block:: javascript

    web3.eth.subscribe('logs', options [, callback]);

Subscribes to incoming logs, filtered by the given options.

----------
Parameters
----------

1. ``"logs"`` - ``String``, the type of the subscription.
2. ``Object`` - The subscription options
  - ``fromBlock`` - ``Number``: The number of the earliest block. By default ``null``.
  - ``address`` - ``String|Array``: An address or a list of addresses to only get logs from particular account(s).
  - ``topics`` - ``Array``: An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use ``null``, e.g. ``[null, '0x00...']``. You can also pass another array for each topic with options for that topic e.g. ``[null, ['option1', 'option2']]``
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

-------
Returns
-------

``EventEmitter``: An :ref:`subscription instance <eth-subscription-return>` as an event emitter with the following events:

- ``"data"`` returns ``Object``: Fires on each incoming log with the log object as argument.
- ``"changed"`` returns ``Object``: Fires on each log which was removed from the blockchain. The log will have the additional property ``"removed: true"``.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occurs.

For the structure of a returned event ``Object`` see :ref:`web3.eth.getPastEvents return values <eth-getpastlogs-return>`.

----------------
Notification returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``Object`` - The log object like in :ref:`web3.eth.getPastEvents return values <eth-getpastlogs-return>`.

-------
Example
-------


.. code-block:: javascript

    var subscription = web3.eth.subscribe('logs', {
        address: '0x123456..',
        topics: ['0x12345...']
    }, function(error, result){
        if (!error)
            console.log(result);
    })
    .on("data", function(log){
        console.log(log);
    })
    .on("changed", function(log){
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });
