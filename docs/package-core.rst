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

Contains the current available :ref:`providers <web3-providers>`.

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


------------------------------------------------------------------------------


BatchRequest
=====================

.. code-block:: javascript

    new web3.BatchRequest()
    new web3.eth.BatchRequest()
    new web3.shh.BatchRequest()
    new web3.bzz.BatchRequest()

Object tp create and execute batch requests.

----------
Parameters
----------

none

-------
Returns
-------

``Object``: With the following methods:

    - ``add(request)``: To add a request object to the batch call.
    - ``execute()``: Will execute the batch request.

-------
Example
-------

.. code-block:: javascript

    var contract = new web3.eth.Contract(abi, address);

    var batch = new web3.BatchRequest();
    batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
    batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}, callback2));
    batch.execute();


