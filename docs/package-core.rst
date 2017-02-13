setProvider
=====================

.. code-block:: javascript

    web3.setProvider(myProvider)
    web3.eth.setProvider(myProvider)
    web3.shh.setProvider(myProvider)
    web3.bzz.setProvider(myProvider)

When called changes the current provider for all modules.

----------
Parameters
----------

1. ``Object`` - **myProvider**: :ref:`a valid provider <web3-providers>`.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    var Web3 = require('web3');
    var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    // change provider
    web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));


------------------------------------------------------------------------------


providers
=====================

.. code-block:: javascript

    web3.providers
    web3.eth.providers
    web3.shh.providers
    web3.bzz.providers

Contains the current available providers

----------
Value
----------

``Object`` with the following providers:

    - ``Object`` - **HttpProvider**: The HTTP provider is deprecated, as it won't work for subscriptions.
    - ``Object`` - **WebsocketProvider**: The Websocket provider is the standard for usage in legacy browsers.
    - ``Object`` - **IpcProvider**: The IPC provider is used node.js dapps when running a local node. Gives the most secure connection.
    - ``Object`` - **givenProvider**: When using web3.js in an Enthereum compatible browser, this will be set with the current native provider by that browser. Doesn't need to be instantiated.

-------
Example
-------

.. code-block:: javascript

    var Web3 = require('web3');
    // use the given Provider, e.g in Mist, or instantiate a new websocket provider
    var web3 = new Web3(Web3.providers.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8546'));

