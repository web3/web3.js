.. _bzz:

.. include:: include_announcement.rst

========
web3.bzz
========

.. note:: This API might change over time.


The ``web3-bzz`` package allows you to interact swarm the decentralized file store.
For more see the `Swarm Docs <http://swarm-guide.readthedocs.io/en/latest/>`_.


.. code-block:: javascript

    import Web3 from 'web3';
    import {Bzz} from 'web3-bzz';

    // will autodetect if a provider is present and will either connect to the local swarm node, or the swarm-gateways.net.
    // Optional you can give your own provider URL; If no provider URL is given it will use "http://swarm-gateways.net"
    const bzz = new Bzz(Web3.givenProvider || 'http://swarm-gateways.net');


    // or using the web3 umbrella package
    const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

    // -> web3.bzz.currentProvider // if Web3.givenProvider was an Ethereum provider it will set: "http://localhost:8500" otherwise it will set: "http://swarm-gateways.net"


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

    import {Bzz} from 'web3-bzz';

    const bzz = new Bzz('http://localhost:8500');

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

    web3.bzz.currentProvider

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

   web3.bzz.upload(mixed)

Uploads files folders or raw data to swarm.

----------
Parameters
----------

1. ``mixed`` - ``String|Buffer|Uint8Array|Object``: The data to upload, can be a file content, file Buffer/Uint8Array, multiple files, or a directory or file (only in node.js). The following types are allowed:
    - ``String|Buffer|Uint8Array``: A file content, file Uint8Array or Buffer to upload, or:
    - ``Object``:
        1. Multiple key values for files and directories. The paths will be kept the same:
            - key must be the files path, or name, e.g. ``"/foo.txt"`` and its value is an object with:
                - ``type``: The mime-type of the file, e.g. ``"text/html"``.
                - ``data``: A file content, file Uint8Array or Buffer to upload.
        2. Upload a file or a directory from disk in Node.js. Requires and object with the following properties:
            - ``path``: The path to the file or directory.
            - ``kind``: The type of the source ``"directory"``, ``"file"`` or ``"data"``.
            - ``defaultFile`` (optional): Path of the "defaultFile" when ``"kind": "directory"``, e.g. ``"/index.html"``.
        3. Upload file or folder in the browser. Requres and object with the following properties:
            - ``pick``: The file picker to launch. Can be ``"file"``, ``"directory"`` or ``"data"``.


-------
Returns
-------

``Promise<String>`` - Returns the content hash of the manifest.


-------
Example
-------

.. code-block:: javascript

    // raw data
    bzz.upload("test file").then((hash) => {
        console.log("Uploaded file. Address:", hash);
    })

    // raw directory
    const dir = {
        "/foo.txt": {type: "text/plain", data: "sample file"},
        "/bar.txt": {type: "text/plain", data: "another file"}
    };

    bzz.upload(dir).then((hash) => {
        console.log("Uploaded directory. Address:", hash);
    });

    // upload from disk in node.js
    bzz.upload({
        path: "/path/to/thing",      // path to data / file / directory
        kind: "directory",           // could also be "file" or "data"
        defaultFile: "/index.html"   // optional, and only for kind === "directory"
    })
    .then(console.log)
    .catch(console.log);

    // upload from disk in the browser
    bzz.upload({pick: "file"}) // could also be "directory" or "data"
    .then(console.log);

------------------------------------------------------------------------------

download
=====================

.. code-block:: javascript

   web3.bzz.download(bzzHash [, localpath])

Downloads files and folders from swarm, as buffer or to disk (only node.js).

----------
Parameters
----------

1. ``bzzHash`` - ``String``: The file or directory to download. If the hash is a raw file it will return a Buffer, if a manifest file, it will return the directory structure. If the ``localpath`` is given, it will return that path where it downloaded the files to.
2. ``localpath`` - ``String``: The local folder to download the content into. (only node.js)

-------
Returns
-------

``Promise<Buffer|Object|String>`` - The Buffer of the file downloaded, an object with the directory structure, or the path where it was downloaded to.


-------
Example
-------

.. code-block:: javascript

    // download raw file
    const fileHash = "a5c10851ef054c268a2438f10a21f6efe3dc3dcdcc2ea0e6a1a7a38bf8c91e23";
    bzz.download(fileHash).then((buffer) => {
        console.log("Downloaded file:", buffer.toString());
    });

    // download directory, if the hash is manifest file.
    const dirHash = "7e980476df218c05ecfcb0a2ca73597193a34c5a9d6da84d54e295ecd8e0c641";
    bzz.download(dirHash).then((dir) => {
        console.log("Downloaded directory:");
        > {
            'bar.txt': { type: 'text/plain', data: <Buffer 61 6e 6f 74 68 65 72 20 66 69 6c 65> },
            'foo.txt': { type: 'text/plain', data: <Buffer 73 61 6d 70 6c 65 20 66 69 6c 65> }
        }
    });

    // download file/directory to disk (only node.js)
    const dirHash = "a5c10851ef054c268a2438f10a21f6efe3dc3dcdcc2ea0e6a1a7a38bf8c91e23";
    bzz.download(dirHash, "/target/dir")
    .then((path) => console.log(`Downloaded directory to ${path}.`))
    .catch(console.log);


------------------------------------------------------------------------------


pick
=====================

.. code-block:: javascript

   web3.bzz.pick.file()
   web3.bzz.pick.directory()
   web3.bzz.pick.data()

Opens a file picker in the browser to select file(s), directory or data.

----------
Parameters
----------

none

-------
Returns
-------

``Promise<Object>`` - Returns the file or multiple files.

-------
Example
-------

.. code-block:: javascript

    web3.bzz.pick.file()
    .then(console.log);
    > {
        ...
    }
