.. _eth-admin:

.. include:: include_announcement.rst

=================
Web3 Debug Module
=================


The ``web3-eth-debug`` package allows you to interact with the Ethereum node's debug methods.


.. code-block:: javascript

    import Web3 from 'web3';
    import {Debug} from 'web3-eth-debug';

    // "Web3.givenProvider" will be set if in an Ethereum supported browser.
    const admin = new Debug(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


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

``Promise<boolean>``

-------
Example
-------

.. code-block:: javascript

    admin.setBackTraceAt("filename.go:200").then(console.log);


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
1. ``seconds`` - ``Number``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - The path.


-------
Example
-------


.. code-block:: javascript

    debug.blockProfile('file', 100).then(console.log);
    > true


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
1. ``seconds`` - ``Number``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - The path.


-------
Example
-------


.. code-block:: javascript

    debug.cpuProfile('file', 100).then(console.log);
    > true

------------------------------------------------------------------------------


dumpBlock
=========

.. code-block:: javascript

    debug.dumpBlock(file, seconds, [, callback])

Retrieves the state that corresponds to the block number and returns a list of accounts (including storage and code).

----------
Parameters
----------


1. ``file`` - ``String``
1. ``seconds`` - ``Number``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` - TBD


-------
Example
-------


.. code-block:: javascript

    debug.dumpBlock('file', 100).then(console.log);
    > Object

------------------------------------------------------------------------------


getGCStats
==========

.. code-block:: javascript

    debug.getGCStats([, callback])

Retrieves the state that corresponds to the block number and returns a list of accounts (including storage and code).

----------
Parameters
----------


1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` - The path.


-------
Example
-------


.. code-block:: javascript

    debug.getGCStats().then(console.log);
    > true


------------------------------------------------------------------------------


getBlockRlp
===========

.. code-block:: javascript

    debug.getBlockRlp(number, [, callback])

Retrieves and returns the RLP encoded block by number.

----------
Parameters
----------


1. ``Number`` - The block number
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>`` - The path.


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
1. ``seconds`` - ``Number``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` - The path.


-------
Example
-------


.. code-block:: javascript

    debug.goTrace('file', 100).then(console.log);
    > true

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


``Promise<Object>`` - The path.


-------
Example
-------


.. code-block:: javascript

    debug.getMemStats().then(console.log);
    > Object

------------------------------------------------------------------------------

getSeedHash
===========

.. code-block:: javascript

    debug.getSeedHash(number, [, callback])

Fetches and retrieves the seed hash of the block by number

----------
Parameters
----------

1. ``Number`` - The block number.
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>`` -


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

1. ``Number`` - The block profile rate.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.setBlockProfileRate().then(console.log);
    > true

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

1. ``number`` - The block number
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.setHead(100).then(console.log);
    > true

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


``Promise<string>`` -


-------
Example
-------


.. code-block:: javascript

    debug.getStacks().then(console.log);
    > true

------------------------------------------------------------------------------

startCPUProfile
===============

.. code-block:: javascript

    debug.startCPUProfile(file, [, callback])

Turns on CPU profiling indefinitely, writing to the given file.

----------
Parameters
----------

1. ``String`` -
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.startCPUProfile().then(console.log);
    > true


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


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.stopCPUProfile().then(console.log);
    > true

------------------------------------------------------------------------------

startGoTrace
============

.. code-block:: javascript

    debug.startGoTrace(file, [, callback])

Turns on CPU profiling indefinitely, writing to the given file.

----------
Parameters
----------

1. ``String``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.startGoTrace('file').then(console.log);
    > true

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


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.stopGoTrace().then(console.log);
    > true

------------------------------------------------------------------------------

traceBlock
===========

.. code-block:: javascript

    debug.traceBlock(blockRlp, options, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String`` - RLP encoded block
1. ``Object`` - TBD
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` -


-------
Example
-------


.. code-block:: javascript

    debug.traceBlock().then(console.log);
    > Object

------------------------------------------------------------------------------

traceBlockByNumber
================

.. code-block:: javascript

    debug.traceBlockByNumber(number, options, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``Number|String`` - The block number as ``hex`` or ``number``
1. ``Object`` - TBD
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` -


-------
Example
-------


.. code-block:: javascript

    debug.traceBlockByNumber().then(console.log);
    > Object

------------------------------------------------------------------------------

traceBlockByHash
================

.. code-block:: javascript

    debug.traceBlockByHash(hash, options, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String`` - The block hash
1. ``Object`` - TBD
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` -


-------
Example
-------


.. code-block:: javascript

    debug.traceBlockByHash().then(console.log);
    > Object

------------------------------------------------------------------------------

traceBlockFromFile
==================

.. code-block:: javascript

    debug.traceBlockFromFile(fileName, options, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String``
1. ``Object`` - TBD
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` -


-------
Example
-------


.. code-block:: javascript

    debug.traceBlockFromFile().then(console.log);
    > Object

------------------------------------------------------------------------------

traceTransaction
==================

.. code-block:: javascript

    debug.traceTransaction(txHash, options, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String`` - The transaction hash
1. ``Object`` - TBD
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` -


-------
Example
-------


.. code-block:: javascript

    debug.traceTransaction('0x0', {}).then(console.log);
    > Object

------------------------------------------------------------------------------

setVerbosity
============

.. code-block:: javascript

    debug.setVerbosity(level, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``Number`` - The verbosity level
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.setVerbosity().then(console.log);
    > true

------------------------------------------------------------------------------

setVerbosityPattern
===================

.. code-block:: javascript

    debug.setVerbosityPattern(pattern, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String`` - The verbosity pattern
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.setVerbosityPattern().then(console.log);
    > true

------------------------------------------------------------------------------

writeBlockProfile
=================

.. code-block:: javascript

    debug.writeBlockProfile(file, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String`` - The file
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.writeBlockProfile().then(console.log);
    > true

------------------------------------------------------------------------------

writeMemProfile
===============

.. code-block:: javascript

    debug.writeMemProfile(file, [, callback])

Stops writing the Go runtime trace.

----------
Parameters
----------

1. ``String`` - The file
1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<boolean>`` -


-------
Example
-------


.. code-block:: javascript

    debug.writeBlockProfile().then(console.log);
    > true
