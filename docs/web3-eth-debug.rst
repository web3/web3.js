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
=========

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

``Promise<String>`` - True if peer added successfully.

-------
Example
-------

.. code-block:: javascript

    admin.setBackTraceAt("filename.go:200").then(console.log);


------------------------------------------------------------------------------


blockProfile
=====================

.. code-block:: javascript

    debug.blockProfile([, callback])

Turns on block profiling for the given duration and writes profile data to disk. It uses a profile rate of 1 for most accurate information.
If a different rate is desired, set the rate and write the profile manually using ``debug.writeBlockProfile``.

----------
Parameters
----------


1. ``file`` - ``String``
1. ``seconds`` - ``Number``
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>`` - The path.


-------
Example
-------


.. code-block:: javascript

    admin.getDataDirectory()
    .then(console.log);
    > "/home/ubuntu/.ethereum"


------------------------------------------------------------------------------

