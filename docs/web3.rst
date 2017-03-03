====
web3
====

The web3.js object is a umbrella package to house all ethereum related modules.

.. code-block:: javascript

    var Web3 = require('web3');

    // "Web3.providers.givenProvider" will be set if in an Ethereum supported browser.
    var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));

    // -> web3.eth
    // -> web3.personal
    // -> web3.shh
    // -> web3.bzz
    // -> web3.utils


------------------------------------------------------------------------------

version
============

.. code-block:: javascript

    web3.version

Contains the version of the ``web3`` container object.

-------
Returns
-------

``String``: The current version.

-------
Example
-------

.. code-block:: javascript

    web3.version;
    > "1.0.0"

------------------------------------------------------------------------------

providers
=====================

.. code-block:: javascript

    web3.providers

Will return an object with different available providers to use when instantiating ``Web3``


-------
Returns
-------

``Object``: A list of providers.

-------
Example
-------

.. code-block:: javascript

    web3.providers
    > {
        HttpProvider: HttpProvider,
        IpcProvider: IpcProvider,
        WebsocketProvider: WebsocketProvider
    }

------------------------------------------------------------------------------

setProvider
=====================

.. code-block:: javascript

    web3.setProvider(myProvider)

When called changes the current provider for all modules.

----------
Parameters
----------

``Object`` - **myProvider**: a valid provider with at least ``send``, ``on`` function

-------
Returns
-------

``undefined``

-------
Example
-------

.. code-block:: javascript

    web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));


------------------------------------------------------------------------------

currentProvider
=====================

.. code-block:: javascript

    web3.currentProvider

Will return the current provider, otherwise ``null``.


-------
Returns
-------

``Object``: The current provider set or ``null``;

-------
Example
-------

.. code-block:: javascript
    if(!web3.currentProvider)
        web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

------------------------------------------------------------------------------
