.. _eth-subscribe:


=========
web3.eth.subscribe
=========

The ``web3.eth.subscribe`` function lets you subscribe to specifc events in the blockchain.



Subscription pattern
=====================

.. code-block:: javascript

    web3.eth.subscribe(type [, options] [, callback]);

----------
Parameters
----------

1. ``String`` - The subscription, you want to subscribe to.
2. ``Mixed`` - (optional) Optional additional parameters, depending on the subscription type.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

.. _eth-subscription-return:

-------
Returns
-------

``EventEmitter`` - A Subscription instance

    - ``subscription.id``: The subscription id, used to identify and unsubscribing the subscription.
    - ``subscription.unsubscribe([callback])``: Unsubscribes the subscription and returns `TRUE` in the callback if successfull.
    - ``on("data")`` returns ``Object``: Fires on each incoming log with the log object as argument.
    - ``on("changed")`` returns ``Object``: Fires on each log which was removed from the blockchain. The log will have the additional property ``"removed: true"``.
    - ``on("error")`` returns ``Object``: Fires when an error in the subscription occours.

----------------
Callback returns
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
            console.log(log);
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });


------------------------------------------------------------------------------


pendingTransactions
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

- ``"data"`` returns ``Object``: Fires on each incoming pending transaction.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occours.

For the structure of the returned object see :ref:`web3.eth.getTransaction() return values <eth-gettransaction-return>`.

----------------
Callback returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``Object`` - The block header object like above.

-------
Example
-------


.. code-block:: javascript

    var subscription = web3.eth.subscribe('pendingTransactions', function(error, result){
        if (!error)
            console.log(transaction);
    })
    .on("data", function(transaction){
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });


------------------------------------------------------------------------------


newBlockHeaders
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
- ``"error"`` returns ``Object``: Fires when an error in the subscription occours.

The structure of a returned block header is as follows:

    - ``Number`` - **number**: The block number. ``null`` when its pending block.
    - ``String`` 32 Bytes - **hash**: Hash of the block. ``null`` when its pending block.
    - ``String`` 32 Bytes - **parentHash**: Hash of the parent block.
    - ``String`` 8 Bytes - **nonce**: Hash of the generated proof-of-work. ``null`` when its pending block.
    - ``String`` 32 Bytes - **sha3Uncles**: SHA3 of the uncles data in the block.
    - ``String`` 256 Bytes - **logsBloom**: The bloom filter for the logs of the block. ``null`` when its pending block.
    - ``String`` 32 Bytes - **transactionsRoot**: The root of the transaction trie of the block
    - ``String`` 32 Bytes - **stateRoot**: The root of the final state trie of the block.
    - ``String`` 32 Bytes - **receiptRoot**: The root of the receipts.
    - ``String`` - **miner**: The address of the beneficiary to whom the mining rewards were given.
    - ``String`` - **extraData**: The "extra data" field of this block.
    - ``Number`` - **gasLimit**: The maximum gas allowed in this block.
    - ``Number`` - **gasUsed**: The total used gas by all transactions in this block.
    - ``Number`` - **timestamp**: The unix timestamp for when the block was collated.

----------------
Callback returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``Object`` - The block header object like above.

-------
Example
-------


.. code-block:: javascript

    var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
        if (!error)
            console.log(blockHeader);
    })
    .on("data", function(blockHeader){
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });

------------------------------------------------------------------------------


syncing
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
- ``"changed"`` returns ``Object``: Fires when the synchronisation is started with ``TRUE`` and when finsihed with ``FALSE``.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occours.

For the structure of a returned event ``Object`` see :ref:`web3.eth.isSyncing return values <eth-issyncing-return>`.

----------------
Callback returns
----------------

1. ``Object|Null`` - First parameter is an error object if the subscription failed.
2. ``Object|Boolean`` - The syncing object, when started it will return ``TRUE`` once or when finished it will return `FALSE` once.

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


logs
=====================

.. code-block:: javascript

    web3.eth.subscribe('logs', options [, callback]);

Subscribes to incoming logs, filtered by the given options.

----------
Parameters
----------

1. ``String`` - ``"logs"``, the type of the subscription.
2. ``Object`` - The subscription options
  - ``Number`` - **fromBlock**: The number of the earliest block. By default ``null``.
  - ``String`` - **address**: An address or a list of addresses to only get logs from particular account(s).
  - ``Array`` - **topics**: An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use ``null``, e.g. ``[null, '0x00...']``. You can also pass another array for each topic with options for that topic e.g. ``[null, ['option1', 'option2']]``
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription.

-------
Returns
-------

``EventEmitter``: An :ref:`subscription instance <eth-subscription-return>` as an event emitter with the following events:

- ``"data"`` returns ``Object``: Fires on each incoming log with the log object as argument.
- ``"changed"`` returns ``Object``: Fires on each log which was removed from the blockchain. The log will have the additional property ``"removed: true"``.
- ``"error"`` returns ``Object``: Fires when an error in the subscription occours.

For the structure of a returned event ``Object`` see :ref:`web3.eth.getPastEvents return values <eth-getpastlogs-return>`.

----------------
Callback returns
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
            console.log(log);
    })
    .on("data", function(log){
    })
    .on("changed", function(log){
    });

    // unsubscribes the subscription
    subscription.unsubscribe(function(error, success){
        if(success)
            console.log('Successfully unsubscribed!');
    });
