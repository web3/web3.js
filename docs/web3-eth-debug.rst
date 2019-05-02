.. _eth-debug:

.. include:: include_announcement.rst

============
Debug Module
============


The ``web3-eth-debug`` module allows you to interact with the Ethereum node's debug methods.


.. code-block:: javascript

    import Web3 from 'web3';
    import {Debug} from 'web3-eth-debug';

    // "Web3.givenProvider" will be set if in an Ethereum supported browser.
    const debug = new Debug(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


------------------------------------------------------------------------------


.. include:: include_package-core.rst



------------------------------------------------------------------------------

setBackTraceAt
==============

.. code-block:: javascript

    debug.setBackTraceAt(location, [callback])

Sets the logging backtrace location.

----------
Parameters
----------

1. ``location`` - ``String``:  The location is specified as ``<filename>:<line>``.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``Promise<null>``

-------
Example
-------

.. code-block:: javascript

    admin.setBackTraceAt('filename.go:200').then(console.log);


------------------------------------------------------------------------------


blockProfile
============

.. code-block:: javascript

    debug.blockProfile(file, seconds, [, callback])

Turns on block profiling for the given duration and writes profile data to disk.
If a custom rate is desired, set the rate and write the profile manually using ``debug.writeBlockProfile``.

----------
Parameters
----------


1. ``file`` - ``String``
1. ``seconds`` - ``Number|String`` The seconds as Hex string or number.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.blockProfile('file', 100).then(console.log);
    > null


------------------------------------------------------------------------------


cpuProfile
==========

.. code-block:: javascript

    debug.cpuProfile(file, seconds, [, callback])

Turns on CPU profiling for the given duration and writes profile data to disk.

----------
Parameters
----------


1. ``file`` - ``String``
1. ``seconds`` - ``Number | String`` The seconds as Hex string or number.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.cpuProfile('file', 100).then(console.log);
    > null

------------------------------------------------------------------------------


dumpBlock
=========

.. code-block:: javascript

    debug.dumpBlock(blockNumber, [, callback])

Retrieves the state that corresponds to the block number and returns a list of accounts (including storage and code).

----------
Parameters
----------


1. ``blockNumber`` - ``Number | String`` The block number as Hex string or number.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.dumpBlock('file', 100).then(console.log);
    {
        root: "19f4ed94e188dd9c7eb04226bd240fa6b449401a6c656d6d2816a87ccaf206f1",
        accounts: {
            fff7ac99c8e4feb60c9750054bdc14ce1857f181: {
                balance: "49358640978154672",
                code: "",
                codeHash: "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                nonce: 2,
                root: "56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                storage: {}
            },
            fffbca3a38c3c5fcb3adbb8e63c04c3e629aafce: {
                balance: "3460945928",
                code: "",
                codeHash: "c5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470",
                nonce: 657,
                root: "56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
                storage: {}
            }
        },
    }


------------------------------------------------------------------------------


getGCStats
==========

.. code-block:: javascript

    debug.getGCStats([, callback])

Returns GC statistics.
See https://golang.org/pkg/runtime/debug/#GCStats for information about the fields of the returned object.

----------
Parameters
----------


1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getGCStats().then(console.log);

------------------------------------------------------------------------------


getBlockRlp
===========

.. code-block:: javascript

    debug.getBlockRlp(number, [, callback])

Retrieves and returns the RLP encoded block by number.

----------
Parameters
----------


1. ``number`` - ``Number | String`` The block number as hex string or number.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>``


-------
Example
-------


.. code-block:: javascript

    debug.getBlockRlp(100).then(console.log);
    > '0x0'


------------------------------------------------------------------------------


goTrace
=======

.. code-block:: javascript

    debug.goTrace(file, seconds, [, callback])

Turns on Go runtime tracing for the given duration and writes trace data to disk.

----------
Parameters
----------

1. ``file`` - ``String``
1. ``seconds`` - ``Number | String`` The seconds as Hex string or number.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.goTrace('file', 100).then(console.log);
    > null

------------------------------------------------------------------------------

getMemStats
===========

.. code-block:: javascript

    debug.getMemStats([, callback])

Returns detailed runtime memory statistics.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getMemStats().then(console.log);
    > MemStats // MemStats object from Go

------------------------------------------------------------------------------

getSeedHash
===========

.. code-block:: javascript

    debug.getSeedHash(number, [, callback])

Fetches and retrieves the seed hash of the block by number

----------
Parameters
----------

1. ``number`` - ``Number | String`` The block number as Hex string or number.
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>``


-------
Example
-------


.. code-block:: javascript

    debug.getSeedHash().then(console.log);
    > '0x0'

------------------------------------------------------------------------------

setBlockProfileRate
===================

.. code-block:: javascript

    debug.setBlockProfileRate(rate, [, callback])

Sets the rate (in samples/sec) of goroutine block profile data collection. A non-zero rate enables block profiling, setting it to zero stops the profile.
Collected profile data can be written using ``debug.writeBlockProfile``.

----------
Parameters
----------

1. ``number`` - ``Number | String`` The block profile rate as number or Hex string.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.setBlockProfileRate().then(console.log);
    > null

------------------------------------------------------------------------------

setHead
=======

.. code-block:: javascript

    debug.setHead(number, [, callback])

Sets the current head of the local chain by block number. Note, this is a destructive action and may severely damage your chain.
Use with extreme caution.

----------
Parameters
----------

1. ``number`` - ``Number | String`` The block number as Hex string or number.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.setHead(100).then(console.log);
    > null

------------------------------------------------------------------------------

getStacks
=========

.. code-block:: javascript

    debug.getStacks([, callback])

Returns a printed representation of the stacks of all goroutines.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>``


-------
Example
-------


.. code-block:: javascript

    debug.getStacks().then(console.log);

------------------------------------------------------------------------------

startCPUProfile
===============

.. code-block:: javascript

    debug.startCPUProfile(file, [, callback])

Turns on CPU profiling indefinitely, writing to the given file.

----------
Parameters
----------

1. ``file`` - ``String``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.startCPUProfile().then(console.log);
    > null


------------------------------------------------------------------------------

stopCPUProfile
==============

.. code-block:: javascript

    debug.stopCPUProfile([, callback])

Stops an ongoing CPU profile.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.stopCPUProfile().then(console.log);
    > null

------------------------------------------------------------------------------

startGoTrace
============

.. code-block:: javascript

    debug.startGoTrace(file, [, callback])

Turns on CPU profiling indefinitely, writing to the given file.

----------
Parameters
----------

1. ``file`` - ``String``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.startGoTrace('file').then(console.log);
    > null

------------------------------------------------------------------------------

stopGoTrace
===========

.. code-block:: javascript

    debug.stopGoTrace([, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.stopGoTrace().then(console.log);
    > null

------------------------------------------------------------------------------

getBlockTrace
=============

.. code-block:: javascript

    debug.getBlockTrace(blockRlp, options, [, callback])

The traceBlock method will return a full stack trace of all invoked opcodes of all transaction that were included included in this block.
Note, the parent of this block must be present or it will fail.

----------
Parameters
----------

1. ``blockRlp`` - ``String`` RLP encoded block
2. ``options`` - ``Object`` The block trace object
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getBlockTrace('0x0', {}).then(console.log);
    > {
        gas: 85301,
        returnValue: "",
        structLogs: [{...}]
    }

------------------------------------------------------------------------------

getBlockTraceByNumber
=====================

.. code-block:: javascript

    debug.getBlockTraceByNumber(number, options, [, callback])

The traceBlockByNumber method accepts a block number and will replay the block that is already present in the database.

----------
Parameters
----------

1. ``number`` - ``Number | String`` The block number as Hex string or number.
2. ``options`` - ``Object`` The block trace object
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getBlockTraceByNumber(100, {}).then(console.log);
    > {
        gas: 85301,
        returnValue: "",
        structLogs: [{...}]
    }

------------------------------------------------------------------------------


getBlockTraceByHash
===================

.. code-block:: javascript

    debug.getBlockTraceByHash(hash, options, [, callback])

The traceBlockByHash accepts a block hash and will replay the block that is already present in the database.

----------
Parameters
----------

1. ``hash`` - ``String`` The block hash
2. ``options`` - ``Object`` The block trace object
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getBlockTraceByHash('0x0', {}).then(console.log);
    > {
        gas: 85301,
        returnValue: "",
        structLogs: [{...}]
    }

------------------------------------------------------------------------------

getBlockTraceFromFile
=====================

.. code-block:: javascript

    debug.getBlockTraceFromFile(fileName, options, [, callback])

The traceBlockFromFile accepts a file containing the RLP of the block.

----------
Parameters
----------

1. ``fileName`` - ``String`` The file name
2. ``options`` - ``Object`` The block trace object
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getBlockTraceFromFile('filename', {}).then(console.log);
    > {
        gas: 85301,
        returnValue: "",
        structLogs: [{...}]
    }

------------------------------------------------------------------------------

getTransactionTrace
===================

.. code-block:: javascript

    debug.getTransactionTrace(txHash, options, [, callback])

The traceTransaction debugging method will attempt to run the transaction in the exact same manner as it was executed on
the network. It will replay any transaction that may have been executed prior to this one before it will finally attempt
to execute the transaction that corresponds to the given hash.

In addition to the hash of the transaction you may give it a secondary optional argument, which specifies the options for this specific call.

The possible options are:

1. ``disableStorage`` - ``boolean`` Setting this to true will disable storage capture (default = false).
1. ``disableMemory`` - ``boolean`` Setting this to true will disable memory capture (default = false).
1. ``disableStack`` - ``boolean`` Setting this to true will disable stack capture (default = false).
1. ``tracer`` - ``string`` Setting this will enable JavaScript-based transaction tracing, described below. If set, the previous four arguments will be ignored.
1. ``timeout`` - ``string`` Overrides the default timeout of 5 seconds for JavaScript-based tracing calls


JSON-RPC specification for `debug_traceTransaction <https://github.com/ethereum/wiki/wiki/JavaScript-API>`_

----------
Parameters
----------

1. ``txHash`` - ``String`` The transaction hash
2. ``options`` - ``Object`` The block trace object
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>``


-------
Example
-------


.. code-block:: javascript

    debug.getTransactionTrace('0x0', {}).then(console.log);
    > {
        gas: 85301,
        returnValue: "",
        structLogs: [{...}]
    }

------------------------------------------------------------------------------

setVerbosity
============

.. code-block:: javascript

    debug.setVerbosity(level, [, callback])

Sets the logging verbosity ceiling. Log messages with level up to and including the given level will be printed.
The verbosity of individual packages and source files can be raised using ``debug.setVerbosityPattern``.

----------
Parameters
----------

1. ``level`` - ``Number | String`` The verbosity level as Hex string or number.
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.setVerbosity(1).then(console.log);
    > null

------------------------------------------------------------------------------

setVerbosityPattern
===================

.. code-block:: javascript

    debug.setVerbosityPattern(pattern, [, callback])

Sets the logging verbosity pattern.

----------
Parameters
----------

1. ``pattern`` - ``String`` The verbosity pattern
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    // If you want to see messages from a particular Go package (directory) and all subdirectories, use:
    debug.setVerbosityPattern('eth/*=6').then(console.log);
    > null

    // If you want to restrict messages to a particular package (e.g. p2p) but exclude subdirectories, use:
    debug.setVerbosityPattern('p2p=6').then(console.log);
    > null

    // If you want to see log messages from a particular source file, use:
    debug.setVerbosityPattern('server.go=6').then(console.log);
    > null

    // You can compose these basic patterns. If you want to see all output from peer.go in a package below eth
    // (eth/peer.go, eth/downloader/peer.go) as well as output from package p2p at level <= 5, use:
    debug.setVerbosityPattern('eth/*/peer.go=6,p2p=5').then(console.log);
    > null


------------------------------------------------------------------------------


writeBlockProfile
=================

.. code-block:: javascript

    debug.writeBlockProfile(file, [, callback])

Writes a goroutine blocking profile to the given file.

----------
Parameters
----------

1. ``file`` - ``String`` The file
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.writeBlockProfile('file').then(console.log);
    > null

------------------------------------------------------------------------------

writeMemProfile
===============

.. code-block:: javascript

    debug.writeMemProfile(file, [, callback])

Writes an allocation profile to the given file.

----------
Parameters
----------

1. ``file`` - ``String`` The file
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<null>``


-------
Example
-------


.. code-block:: javascript

    debug.writeBlockProfile('file').then(console.log);
    > null
