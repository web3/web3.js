.. _bzz:

.. include:: include_announcement.rst

========
web3.bzz
========

.. note:: This API might change over time.


The ``web3-bzz`` package allows you to interact swarm the decentralized file store.
For more see the `Swarm Docs <http://swarm-guide.readthedocs.io/en/latest/>`_.


.. code-block:: javascript

    var Bzz = require('web3-bzz');

    // will autodetect if the "ethereum" object is present and will either connect to the local swarm node, or the swarm-gateways.net.
    // Optional you can give your own "url"
    var bzz = new Bzz(Bzz.givenProvider || 'http://swarm-gateways.net');


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

    // -> web3.bzz.currentProvider // http://localhost:8500 or http://swarm-gateways.net


------------------------------------------------------------------------------


setProvider
=====================

.. code-block:: javascript

    web3.bzz.setProvider(myProvider)

Will change the provider for its module.

.. note:: When called on the umbrella package ``web3`` it will also set the provider for all sub modules ``web3.eth``, ``web3.shh``, etc EXCEPT ``web3.bzz`` which needs a separate provider at all times.

----------
Parameters
----------

1. ``Object`` - ``myProvider``: :ref:`a valid provider <web3-providers>`.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    var Bzz = require('web3-bzz');
    var bzz = new Bzz('http://localhost:8500');

    // change provider
    bzz.setProvider('http://swarm-gateways.net');


------------------------------------------------------------------------------

givenProvider
=====================

.. code-block:: javascript

    web3.bzz.givenProvider

When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser.
Will return the given provider by the (browser) environment, otherwise ``null``.


-------
Returns
-------

``Object``: The given provider set or ``null``;

-------
Example
-------

.. code-block:: javascript

    bzz.givenProvider;
    > {
        send: function(),
        on: function(),
        bzz: "http://localhost:8500",
        shh: true,
        ...
    }

    bzz.setProvider(bzz.givenProvider || "http://swarm-gateways.net");


------------------------------------------------------------------------------


currentProvider
=====================

.. code-block:: javascript

    bzz.currentProvider

Will return the current provider URL, otherwise ``null``.


-------
Returns
-------

``Object``: The current provider URL or ``null``;

-------
Example
-------

.. code-block:: javascript

    bzz.currentProvider;
    > "http://localhost:8500"


    if(!bzz.currentProvider) {
        bzz.setProvider("http://swarm-gateways.net");
    }


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


