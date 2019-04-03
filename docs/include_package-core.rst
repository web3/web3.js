options
=====================

An Web3 module does provide several options for configuring the transaction confirmation worklfow or for defining default values.
These are the currently available option properties on a Web3 module:

.. _web3-module-options:

--------------
Module Options
--------------

:ref:`defaultAccount <web3-module-defaultaccount>`

:ref:`defaultBlock <web3-module-defaultblock>`

:ref:`defaultGas <web3-module-defaultgas>`

:ref:`defaultGasPrice <web3-module-defaultaccount>`

:ref:`transactionBlockTimeout <web3-module-transactionblocktimeout>`

:ref:`transactionConfirmationBlocks <web3-module-transactionconfirmationblocks>`

:ref:`transactionPollingTimeout <web3-module-transactionpollingtimeout>`

:ref:`transactionSigner <web3-module-transactionSigner>`

-------
Example
-------

.. code-block:: javascript

    import Web3 from 'web3';

    const options = {
        defaultAccount: '0x0',
        defaultBlock: 'latest',
        defaultGas: 1,
        defaultGasPrice: 0,
        transactionBlockTimeout: 50,
        transactionConfirmationBlocks: 24,
        transactionPollingTimeout: 480,
        transactionSigner: new CustomTransactionSigner()
    }

    const web3 = new Web3('http://localhost:8545', null, options);

------------------------------------------------------------------------------

.. _web3-module-defaultblock:

defaultBlock
=====================

.. code-block:: javascript

    web3.defaultBlock
    web3.eth.defaultBlock
    web3.shh.defaultBlock
    ...

The default block is used for all methods which have a block parameter.
You can override it by passing in the defaultBlock as last parameter.

- :ref:`web3.eth.getBalance() <eth-getbalance>`
- :ref:`web3.eth.getCode() <eth-getcode>`
- :ref:`web3.eth.getTransactionCount() <eth-gettransactioncount>`
- :ref:`web3.eth.getStorageAt() <eth-getstorageat>`
- :ref:`web3.eth.call() <eth-call>`
- :ref:`new web3.eth.Contract() -> myContract.methods.myMethod().call() <contract-call>`

-------
Returns
-------

Default block parameters can be one of the following:

- ``Number``: A block number
- ``"genesis"`` - ``String``: The genesis block
- ``"latest"`` - ``String``: The latest block (current head of the blockchain)
- ``"pending"`` - ``String``: The currently mined block (including pending transactions)

Default is ``"latest"``

------------------------------------------------------------------------------

.. _web3-module-defaultaccount:

defaultAccount
=====================

.. code-block:: javascript

    web3.defaultAccount
    web3.eth.defaultAccount
    web3.shh.defaultAccount
    ...

This default address is used as the default ``"from"`` property, if no ``"from"`` property is specified.

-------
Returns
-------

``String`` - 20 Bytes: Any Ethereum address. You need to have the private key for that address in your node or keystore. (Default is ``undefined``)

------------------------------------------------------------------------------

.. _web3-module-defaultgasprice:

defaultGasPrice
=====================

.. code-block:: javascript

    web3.defaultGasPrice
    web3.eth.defaultGasPrice
    web3.shh.defaultGasPrice
    ...

The default gas price which will be used for a request.

-------
Returns
-------

``string|number``: The current value of the defaultGasPrice property.


------------------------------------------------------------------------------

.. _web3-module-defaultgas:

defaultGas
=====================

.. code-block:: javascript

    web3.defaultGas
    web3.eth.defaultGas
    web3.shh.defaultGas
    ...

The default gas which will be used for a request.

-------
Returns
-------

``string|number``: The current value of the defaultGas property.

------------------------------------------------------------------------------

.. _web3-module-transactionblocktimeout:

transactionBlockTimeout
=====================

.. code-block:: javascript

    web3.transactionBlockTimeout
    web3.eth.transactionBlockTimeout
    web3.shh.transactionBlockTimeout
    ...

This can be used with a socket provider and defines the number of blocks until the PromiEvent
rejects with a timeout error.


-------
Returns
-------

``number``: The current value of transactionBlockTimeout

------------------------------------------------------------------------------

.. _web3-module-transactionconfirmationblocks:

transactionConfirmationBlocks
=====================

.. code-block:: javascript

    web3.transactionConfirmationBlocks
    web3.eth.transactionConfirmationBlocks
    web3.shh.transactionConfirmationBlocks
    ...

This defines the number of blocks it requires until a transaction will be handled as confirmed.
The PromiEvent will resolve with the desired receipt when enough confirmations happened.


-------
Returns
-------

``number``: The current value of transactionConfirmationBlocks

------------------------------------------------------------------------------


.. _web3-module-transactionpollingtimeout:

transactionPollingTimeout
=====================

.. code-block:: javascript

    web3.transactionPollingTimeout
    web3.eth.transactionPollingTimeout
    web3.shh.transactionPollingTimeout
    ...

This defines the polling cycles amount when you send a transaction with the HttpProvider.
The PromiEvent rejects with a timeout error when the timeout got exceeded. (1 cycle == 1sec.).


-------
Returns
-------

``number``: The current value of transactionPollingTimeout

------------------------------------------------------------------------------


.. _web3-module-transactionSigner:

transactionSigner
=================

.. code-block:: javascript

    web3.eth.transactionSigner
    ...



The ``transactionSigner`` property does provide us the possibility to customize the signing process
of the ``Eth`` module and the related sub-modules.

The interface of a ``TransactionSigner``:

.. code-block:: javascript

    interface TransactionSigner {
        sign(txObject: Transaction): Promise<SignedTransaction>
    }

    interface SignedTransaction {
        messageHash: string,
        v: string,
        r: string,
        s: string,
        rawTransaction: string
    }



-------
Returns
-------

``TransactionSigner``: A JavaScript class of type TransactionSigner.

------------------------------------------------------------------------------

setProvider
=====================

.. code-block:: javascript

    web3.setProvider(myProvider)
    web3.eth.setProvider(myProvider)
    web3.shh.setProvider(myProvider)
    web3.bzz.setProvider(myProvider)
    ...

Will change the provider for its module.

.. note:: When called on the umbrella package ``web3`` it will also set the provider for all sub modules ``web3.eth``, ``web3.shh``, etc EXCEPT ``web3.bzz`` which needs a separate provider at all times.

----------
Parameters
----------

1. ``Object|String`` - ``provider``: a valid provider
2. ``Net`` - ``net``: (optional) the node.js Net package. This is only required for the IPC provider.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    import Web3 from 'web3';

    const web3 = new Web3('http://localhost:8545');

    // or
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    // change provider
    web3.setProvider('ws://localhost:8546');
    // or
    web3.setProvider(new Web3.providers.WebsocketProvider('ws://localhost:8546'));

    // Using the IPC provider in node.js
    const net = require('net');
    const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path

    // or
    const web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
    // on windows the path is: '\\\\.\\pipe\\geth.ipc'
    // on linux the path is: '/users/myuser/.ethereum/geth.ipc'

------------------------------------------------------------------------------

providers
=====================

.. code-block:: javascript

    Web3.providers
    Eth.providers
    ...

Contains the current available providers.

----------
Value
----------

``Object`` with the following providers:

    - ``Object`` - ``HttpProvider``: The HTTP provider is **deprecated**, as it won't work for subscriptions.
    - ``Object`` - ``WebsocketProvider``: The Websocket provider is the standard for usage in legacy browsers.
    - ``Object`` - ``IpcProvider``: The IPC provider is used node.js dapps when running a local node. Gives the most secure connection.

-------
Example
-------

.. code-block:: javascript

    const Web3 = require('web3');
    // use the given Provider, e.g in Mist, or instantiate a new websocket provider
    const web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
    // or
    const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8546'));

    // Using the IPC provider in node.js
    const net = require('net');

    const web3 = new Web3('/Users/myuser/Library/Ethereum/geth.ipc', net); // mac os path
    // or
    const web3 = new Web3(new Web3.providers.IpcProvider('/Users/myuser/Library/Ethereum/geth.ipc', net)); // mac os path
    // on windows the path is: '\\\\.\\pipe\\geth.ipc'
    // on linux the path is: '/users/myuser/.ethereum/geth.ipc'

------------------------------------------------------------------------------

givenProvider
=====================

.. code-block:: javascript

    Web3.givenProvider
    web3.eth.givenProvider
    web3.shh.givenProvider
    web3.bzz.givenProvider
    ...

When using web3.js in an Ethereum compatible browser, it will set with the current native provider by that browser.
Will return the given provider by the (browser) environment, otherwise ``null``.


-------
Returns
-------

``Object``: The given provider set or ``false``.

-------
Example
-------

.. code-block:: javascript

    web3.setProvider(Web3.givenProvider || 'ws://localhost:8546');


------------------------------------------------------------------------------


currentProvider
=====================

.. code-block:: javascript

    web3.currentProvider
    web3.eth.currentProvider
    web3.shh.currentProvider
    web3.bzz.currentProvider
    ...

Will return the current provider.


-------
Returns
-------

``Object``: The current provider set.

-------
Example
-------

.. code-block:: javascript

    if (!web3.currentProvider) {
        web3.setProvider('http://localhost:8545');
    }

------------------------------------------------------------------------------

BatchRequest
=====================

.. code-block:: javascript

    new web3.BatchRequest()
    new web3.eth.BatchRequest()
    new web3.shh.BatchRequest()
    ...

Class to create and execute batch requests.

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

    const contract = new web3.eth.Contract(abi, address);

    const batch = new web3.BatchRequest();
    batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest'));
    batch.add(contract.methods.balance(address).call.request({from: '0x0000000000000000000000000000000000000000'}));
    batch.execute().then(...);
