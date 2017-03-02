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


upload
=====================

.. code-block:: javascript

   web3.shh.upload(localfspath, defaultfile [, callback])

Uploads files or folders to swarm.

----------
Parameters
----------

1. ``String`` - ``localfspath``: The file or directory to upload.
2. ``String`` - ``defaultfile``: The default to use when no file on the manifest path could be mapped. For JavaScript Dapps that is normally an ``index.html``.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``String``: Returns the content hash of the manifest.


-------
Example
-------

.. code-block:: javascript

    web3.shh.upload('/User/me/sites/myApp', '/User/me/sites/myApp/index.html')
    .then(console.log);
    > '246749122b6435dc395250c44c8ebc2eaa13dff2f3986ce5265148d84e619d20'


------------------------------------------------------------------------------

download
=====================

.. code-block:: javascript

   web3.shh.download(bzzHash, localdirpath [, callback])

Downloads files and folders from swarm.

----------
Parameters
----------

1. ``bzzHash`` - ``String``: The file or directory to download.
2. ``localdirpath`` - ``String``: The local folder to download the content into.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``?``:


-------
Example
-------

.. code-block:: javascript

    web3.shh.download('246749122b6435dc395250c44c8ebc2eaa13dff2f3986ce5265148d84e619d20', '/User/me/sites/someApp')
    .then(console.log);
    >


------------------------------------------------------------------------------


put
=====================

.. code-block:: javascript

   web3.shh.put(content, contentType [, callback])

Allows to upload a raw data blob to swarm.
Creates a manifest with an entry. This entry has the empty path and specifies the content type given as second argument.

----------
Parameters
----------

1. ``content`` - ``String``: The data blob to store.
2. ``contentType`` - ``String``: The MIME content type to assign for that data.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``String``: Returns the content hash of the manifest.

-------
Example
-------

.. code-block:: javascript

    web3.shh.put('0x2345676432', 'text/html')
    .then(console.log);
    > '246749122b6435dc395250c44c8ebc2eaa13dff2f3986ce5265148d84e619d20'


------------------------------------------------------------------------------

getManifest
=====================

.. code-block:: javascript

   web3.shh.getManifest(bzzHash [, callback])

Description missing.

----------
Parameters
----------

1. ``bzzHash`` - ``String``: The path to a file, it will then download its manifest JSON file.
2. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``Object``: the manifest JSON object of the hash location


-------
Example
-------

.. code-block:: javascript

    web3.shh.getManifest('246749122b6435dc395250c44c8ebc2eaa13dff2f3986ce5265148d84e619d20')
    .then(console.log);
    > {
        ?
    }


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


