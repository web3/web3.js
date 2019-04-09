.. _eth-admin:

.. include:: include_announcement.rst

==============
web3.eth.admin
==============


The ``web3-eth-admin`` package allows you to interact with the Ethereum node's admin management.


.. code-block:: javascript

    import Web3 from 'web3';
    import {Admin} from 'web3-eth-admin';

    // "Web3.givenProvider" will be set if in an Ethereum supported browser.
    const admin = new Admin(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);


    // or using the web3 umbrella package
    const web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546', null, options);

    // -> web3.eth.admin


------------------------------------------------------------------------------


.. include:: include_package-core.rst



------------------------------------------------------------------------------

.. _admin-addpeer:

addPeer
=========

.. code-block:: javascript

    web3.eth.admin.addPeer(url, [callback])

Add an admin peer on the node that Web3 is connected to with its provider.
The RPC method used is ``admin_addPeer``.

----------
Parameters
----------

1. ``url`` - ``String``:  The enode URL of the remote peer.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``Promise<boolean>`` - True if peer added successfully.

-------
Example
-------

.. code-block:: javascript

    web3.eth.admin.addPeer("enode://a979fb575495b8d6db44f750317d0f4622bf4c2aa3365d6af7c284339968eef29b69ad0dce72a4d8db5ebb4968de0e3bec910127f134779fbcb0cb6d3331163c@52.16.188.185:30303")
    .then(console.log);
    > true

------------------------------------------------------------------------------


getDataDirectory
=====================

.. code-block:: javascript

    web3.eth.admin.getDataDirectory([, callback])

Provides absolute path of the running node, which is used by the node to store all its databases.

----------
Parameters
----------


1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>`` - The path.


-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.getDataDirectory()
    .then(console.log);
    > "/home/ubuntu/.ethereum"


------------------------------------------------------------------------------


getNodeInfo
=====================

.. code-block:: javascript

    web3.eth.personal.getNodeInfo([, callback])

This property can be queried for all the information known about the running node at the networking granularity..

----------
Parameters
----------


1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<object>`` - The node information array.

    - ``enode`` - ``string``: Enode address of the node.
    - ``id`` - ``string``: Node Id.
    - ``listenAddr`` - ``string``: lister host and port address.
    - ``name`` - ``string``: Name of the node, including client type, version, OS, custom data
    - ``discovery`` - ``number``: UDP listening port for discovery protocol
    - ``listener`` - ``number``: TCP listening port for RLPx
    - ``difficulty`` - ``number``:  Difficulty level applied during the nonce discovering of this block.
    - ``genesis`` - ``string``: Very first block hash.
    - ``head`` - ``string``: Current block hash.
    - ``network`` - ``number``: currenty used Ethereum networks ids.


-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.getNodeInfo().then(console.log);
    > {
        enode: "enode://44826a5d6a55f88a18298bca4773fca5749cdc3a5c9f308aa7d810e9b31123f3e7c5fba0b1d70aac5308426f47df2a128a6747040a3815cc7dd7167d03be320d@[::]:30303",
        id: "44826a5d6a55f88a18298bca4773fca5749cdc3a5c9f308aa7d810e9b31123f3e7c5fba0b1d70aac5308426f47df2a128a6747040a3815cc7dd7167d03be320d",
        ip: "::",
        listenAddr: "[::]:30303",
        name: "Geth/v1.5.0-unstable/linux/go1.6",
        ports: {
            discovery: 30303,
            listener: 30303
        },
        protocols: {
            eth: {
            difficulty: 17334254859343145000,
            genesis: "0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3",
            head: "0xb83f73fbe6220c111136aefd27b160bf4a34085c65ba89f24246b3162257c36a",
            network: 1
            }
        }
    }

------------------------------------------------------------------------------


getPeers
=====================

.. code-block:: javascript

    web3.eth.admin.getPeers([, callback])

This will provide all the information known about the connected remote nodes at the networking granularity.

----------
Parameters
----------


1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<Object>`` - List of all connected peers.

    - ``caps`` - ``Array``: Protocols advertised by this peer.
    - ``id`` - ``string``: Peer node Id.
    - ``name`` - ``string``: Peer name of the node, including client type, version, OS, custom data
    - ``localAddress`` - ``string``: Local endpoint of the TCP data connection.
    - ``remoteAddress`` - ``string``: Remote endpoint of the TCP data connection.
    - ``difficulty`` - ``number``:  Difficulty level applied during the nonce discovering of this block.
    - ``head`` - ``string``: Peer's current block hash.
    - ``version`` - ``number``: Version number of the protocol.


-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.getPeers().then(console.log);
    > [{
            caps: ["eth/61", "eth/62", "eth/63"],
            id: "08a6b39263470c78d3e4f58e3c997cd2e7af623afce64656cfc56480babcea7a9138f3d09d7b9879344c2d2e457679e3655d4b56eaff5fd4fd7f147bdb045124",
            name: "Geth/v1.5.0-unstable/linux/go1.5.1",
            network: {
                localAddress: "192.168.0.104:51068",
                remoteAddress: "71.62.31.72:30303"
            },
            protocols: {
                eth: {
                    difficulty: 17334052235346465000,
                    head: "5794b768dae6c6ee5366e6ca7662bdff2882576e09609bf778633e470e0e7852",
                    version: 63
                }
            }
        }, /* ... */ {
            caps: ["eth/61", "eth/62", "eth/63"],
            id: "fcad9f6d3faf89a0908a11ddae9d4be3a1039108263b06c96171eb3b0f3ba85a7095a03bb65198c35a04829032d198759edfca9b63a8b69dc47a205d94fce7cc",
            name: "Geth/v1.3.5-506c9277/linux/go1.4.2",
            network: {
                localAddress: "192.168.0.104:55968",
                remoteAddress: "121.196.232.205:30303"
            },
            protocols: {
            eth: {
                difficulty: 17335165914080772000,
                head: "5794b768dae6c6ee5366e6ca7662bdff2882576e09609bf778633e470e0e7852",
                version: 63
            }
        }
    }]

------------------------------------------------------------------------------


setSolc
=====================

.. code-block:: javascript

    web3.eth.admin.setSolc(string, [, callback])

Sets the Solidity compiler path to be used by the node when invoking the eth_compileSolidity RPC method

----------
Parameters
----------


1. ``String`` - The path of the solidity compiler.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>`` - A message.


-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.setSolc("/usr/bin/solc").then(console.log);
    > "solc, the solidity compiler commandline interface\nVersion: 0.3.2-0/Release-Linux/g++/Interpreter\n\npath: /usr/bin/solc"

------------------------------------------------------------------------------


startRPC
=====================

.. code-block:: javascript

    web3.eth.admin.startRPC(host, port, cors, apis [, callback])

It starts an HTTP based JSON RPC API webserver to handle client requests. All the parameters are optional.

----------
Parameters
----------

1. ``host`` - ``String`` - (optional) The network interface to open the listener socket on (defaults to "localhost").
2. ``port`` - ``string | number`` - (optional) The network port to open the listener socket on (defaults to 8545).
3. ``cors`` - ``string`` - (optional) Cross-origin resource sharing header to use (defaults to "").
4. ``apis`` - ``string`` -  (optional) API modules to offer over this interface (defaults to "eth,net,web3").
5. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise<boolean>`` - True if Remote Procedure Call (RPC) got started.

-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.startRPC("127.0.0.1", 8545)
    .then(console.log('RPC Started!'));
    > "RPC Started!"

------------------------------------------------------------------------------


startWS
=====================

.. code-block:: javascript

    web3.eth.admin.startWS(host, port, cors, apis [, callback])

It starts an WebSocket based JSON RPC API webserver to handle client requests. All the parameters are optional.

----------
Parameters
----------

1. ``host`` - ``String`` - (optional) The network interface to open the listener socket on (defaults to "localhost").
2. ``port`` - ``string | number`` - (optional) The network port to open the listener socket on (defaults to 8545).
3. ``cors`` - ``string`` - (optional) Cross-origin resource sharing header to use (defaults to "").
4. ``apis`` - ``string`` -  (optional) API modules to offer over this interface (defaults to "eth,net,web3").
5. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise<boolean>`` - True if Web socket (WS) got started.

-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.startRPC("127.0.0.1", 8546)
    .then(console.log('WS Started!'));
    > "WS Started!"

------------------------------------------------------------------------------

stopRPC
=====================

.. code-block:: javascript

    web3.eth.admin.stopRPC([, callback])

This method closes the currently open HTTP RPC endpoint. As the node can only have a single HTTP endpoint running, this method takes no parameters, returning a boolean whether the endpoint was closed or not.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise<boolean>`` - True if Remote Procedure Call (RPC) successfully stopped.

-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.stopRPC().then(console.log);
    > true

------------------------------------------------------------------------------

stopWS
=====================

.. code-block:: javascript

    web3.eth.admin.stopWS([, callback])

This method closes the currently open WebSocket RPC endpoint. As the node can only have a single WebSocket endpoint running, this method takes no parameters, returning a boolean whether the endpoint was closed or not.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise<boolean>`` - True if Web Socket (WS) successfully stopped.

-------
Example
-------


.. code-block:: javascript

    web3.eth.admin.stopWS().then(console.log);
    > true

------------------------------------------------------------------------------
