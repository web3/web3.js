========
web3.bzz
========

.. note:: this API is not final yet!!


The ``web3-bzz`` package allows you to interact swarm the decentralized file store.
For more see the `Swarm Docs <http://swarm-guide.readthedocs.io/en/latest/>`_.


.. code-block:: javascript

    var Bzz = require('web3-bzz');

    // "Bzz.providers.givenProvider" will be set if in an Ethereum supported browser.
    var bzz = new Bzz(Bzz.providers.givenProvider || new Bzz.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.providers.givenProvider || new Web3.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));

    // -> web3.bzz


------------------------------------------------------------------------------


.. include:: package-core.rst


------------------------------------------------------------------------------


download
=====================

.. code-block:: javascript

   web3.shh.download(?, ? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``?``: ?
3. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.download(?, ?)
    .then(console.log);
    >


------------------------------------------------------------------------------


upload
=====================

.. code-block:: javascript

   web3.shh.upload(?, ? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``?``: ?
3. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.upload(?, ?)
    .then(console.log);
    >


------------------------------------------------------------------------------


retrieve
=====================

.. code-block:: javascript

   web3.shh.retrieve(? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.retrieve(?)
    .then(console.log);
    >


------------------------------------------------------------------------------


store
=====================

.. code-block:: javascript

   web3.shh.store(?, ? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``?``: ?
3. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.store(?, ?)
    .then(console.log);
    >


------------------------------------------------------------------------------


get
=====================

.. code-block:: javascript

   web3.shh.get(? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.get(?)
    .then(console.log);
    >


------------------------------------------------------------------------------


put
=====================

.. code-block:: javascript

   web3.shh.put(?, ? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``?``: ?
3. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.put(?, ?)
    .then(console.log);
    >


------------------------------------------------------------------------------


modify
=====================

.. code-block:: javascript

   web3.shh.modify(?, ?, ?, ? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``?``: ?
3. ``?``: ?
4. ``?``: ?
5. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.modify(?, ?, ?, ?)
    .then(console.log);
    >


------------------------------------------------------------------------------


getHive
=====================

.. code-block:: javascript

   web3.shh.getHive([callback])

Description missing.

----------
Parameters
----------

1. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.getHive()
    .then(console.log);
    >


------------------------------------------------------------------------------

getInfo
=====================

.. code-block:: javascript

   web3.shh.getInfo([callback])

Description missing.

----------
Parameters
----------

1. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.getInfo()
    .then(console.log);
    >

------------------------------------------------------------------------------

blockNetworkRead
=====================

.. code-block:: javascript

   web3.shh.blockNetworkRead(? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.blockNetworkRead(?)
    .then(console.log);
    >


------------------------------------------------------------------------------


syncEnabled
=====================

.. code-block:: javascript

   web3.shh.syncEnabled(? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.syncEnabled(?)
    .then(console.log);
    >


------------------------------------------------------------------------------


swapEnabled
=====================

.. code-block:: javascript

   web3.shh.swapEnabled(? [, callback])

Description missing.

----------
Parameters
----------

1. ``?``: ?
2. ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.swapEnabled(?)
    .then(console.log);
    >
