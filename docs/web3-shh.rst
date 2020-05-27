.. _shh:

========
web3.shh
========


The ``web3-shh`` package allows you to interact with the whisper protocol for broadcasting. For more see `Whisper Overview <https://github.com/ethereum/go-ethereum/wiki/Whisper>`_.


.. code-block:: javascript

    var Shh = require('web3-shh');

    // "Shh.providers.givenProvider" will be set if in an Ethereum supported browser.
    var shh = new Shh(Shh.givenProvider || 'ws://some.local-or-remote.node:8546');


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

    // -> web3.shh


------------------------------------------------------------------------------


.. include:: include_package-core.rst



------------------------------------------------------------------------------


.. include:: include_package-net.rst


------------------------------------------------------------------------------

getVersion
=====================

.. code-block:: javascript

    web3.shh.getVersion([callback])

Returns the version of the running whisper.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - The version of the current whisper running.


-------
Example
-------


.. code-block:: javascript

    web3.shh.getVersion()
    .then(console.log);
    > "5.0"


------------------------------------------------------------------------------

.. _shh-getinfo:

getInfo
=====================

.. code-block:: javascript

    web3.shh.getInfo([callback])

Gets information about the current whisper node.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Object`` - The information of the node with the following properties:

    - ``messages`` - ``Number``: Number of currently floating messages.
    - ``maxMessageSize`` - ``Number``: The current message size limit in bytes.
    - ``memory`` - ``Number``: The memory size of the floating messages in bytes.
    - ``minPow`` - ``Number``: The current minimum PoW requirement.


-------
Example
-------


.. code-block:: javascript

    web3.shh.getInfo()
    .then(console.log);
    > {
        "minPow": 0.8,
        "maxMessageSize": 12345,
        "memory": 1234335,
        "messages": 20
    }


------------------------------------------------------------------------------

setMaxMessageSize
=====================

.. code-block:: javascript

    web3.shh.setMaxMessageSize(size, [callback])

Sets the maximal message size allowed by this node. Incoming and outgoing messages with a larger size will be rejected.
Whisper message size can never exceed the limit imposed by the underlying P2P protocol (10 Mb).

----------
Parameters
----------

1. ``Number`` - Message size in bytes.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on success, error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.setMaxMessageSize(1234565)
    .then(console.log);
    > true


------------------------------------------------------------------------------

setMinPoW
=====================

.. code-block:: javascript

    web3.shh.setMinPoW(pow, [callback])

Sets the minimal PoW required by this node.

This experimental function was introduced for the future dynamic adjustment of PoW requirement.
If the node is overwhelmed with messages, it should raise the PoW requirement and notify the peers.
The new value should be set relative to the old value (e.g. double). The old value can be obtained via :ref:`web3.shh.getInfo() <shh-getinfo>`.

----------
Parameters
----------

1. ``Number`` - The new PoW requirement.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on success, error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.setMinPoW(0.9)
    .then(console.log);
    > true


------------------------------------------------------------------------------

markTrustedPeer
=====================

.. code-block:: javascript

    web3.shh.markTrustedPeer(enode, [callback])

Marks specific peer trusted, which will allow it to send historic (expired) messages.

.. note:: This function is not adding new nodes, the node needs to be an existing peer.

----------
Parameters
----------

1. ``String`` - Enode of the trusted peer.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on success, error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.markTrustedPeer()
    .then(console.log);
    > true


------------------------------------------------------------------------------

newKeyPair
=====================

.. code-block:: javascript

    web3.shh.newKeyPair([callback])

Generates a new public and private key pair for message decryption and encryption.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - Key ID on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.newKeyPair()
    .then(console.log);
    > "5e57b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f"


------------------------------------------------------------------------------

addPrivateKey
=====================

.. code-block:: javascript

    web3.shh.addPrivateKey(privateKey, [callback])

Stores a key pair derived from a private key, and returns its ID.

----------
Parameters
----------

1. ``String`` - The private key as HEX bytes to import.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - Key ID on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.addPrivateKey('0x8bda3abeb454847b515fa9b404cede50b1cc63cfdeddd4999d074284b4c21e15')
    .then(console.log);
    > "3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f"


------------------------------------------------------------------------------

deleteKeyPair
=====================

.. code-block:: javascript

    web3.shh.deleteKeyPair(id, [callback])

Deletes the specifies key if it exists.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newKeyPair`` and ``shh.addPrivateKey``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on success, error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.deleteKeyPair('3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > true


------------------------------------------------------------------------------

hasKeyPair
=====================

.. code-block:: javascript

    web3.shh.hasKeyPair(id, [callback])

Checks if the whisper node has a private key of a key pair matching the given ID.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newKeyPair`` and ``shh.addPrivateKey``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on if the key pair exist in the node, ``false`` if not. Error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.hasKeyPair('fe22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > true


------------------------------------------------------------------------------

getPublicKey
=====================

.. code-block:: javascript

    web3.shh.getPublicKey(id, [callback])

Returns the public key for a key pair ID.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newKeyPair`` and ``shh.addPrivateKey``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - Public key on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.getPublicKey('3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > "0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa099652ce4df00c4c6e0263eafe05007a46fdf0c8d32b11aeabcd3abbc7b2bc2bb967368a68e9c6"


------------------------------------------------------------------------------

getPrivateKey
=====================

.. code-block:: javascript

    web3.shh.getPrivateKey(id, [callback])

Returns the private key for a key pair ID.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newKeyPair`` and ``shh.addPrivateKey``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - Private key on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.getPrivateKey('3e22b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > "0x234234e22b9ffc2387e18636e0534534a3d0c56b0243567432453264c16e78a2adc"


------------------------------------------------------------------------------

newSymKey
=====================

.. code-block:: javascript

    web3.shh.newSymKey([callback])

Generates a random symmetric key and stores it under an ID, which is then returned.
Will be used for encrypting and decrypting of messages where the sym key is known to both parties.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - Key ID on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.newSymKey()
    .then(console.log);
    > "cec94d139ff51d7df1d228812b90c23ec1f909afa0840ed80f1e04030bb681e4"


------------------------------------------------------------------------------

addSymKey
=====================

.. code-block:: javascript

    web3.shh.addSymKey(symKey, [callback])

Stores the key, and returns its ID.

----------
Parameters
----------

1. ``String`` - The raw key for symmetric encryption as HEX bytes.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - Key ID on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.addSymKey('0x5e11b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > "fea94d139ff51d7df1d228812b90c23ec1f909afa0840ed80f1e04030bb681e4"


------------------------------------------------------------------------------

generateSymKeyFromPassword
=====================

.. code-block:: javascript

    web3.shh.generateSymKeyFromPassword(password, [callback])

Generates the key from password, stores it, and returns its ID.

----------
Parameters
----------

1. ``String`` - A password to generate the sym key from.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise<string>|undefined`` - Returns the Key ID as Promise or undefined if a callback is defined.


-------
Example
-------


.. code-block:: javascript

    web3.shh.generateSymKeyFromPassword('Never use this password - password!')
    .then(console.log);
    > "2e57b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f"


------------------------------------------------------------------------------

hasSymKey
=====================

.. code-block:: javascript

    web3.shh.hasSymKey(id, [callback])

Checks if there is a symmetric key stored with the given ID.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newSymKey``, ``shh.addSymKey`` or ``shh.generateSymKeyFromPassword``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on if the symmetric key exist in the node, ``false`` if not. Error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.hasSymKey('f6dcf21ed6a17bd78d8c4c63195ab997b3b65ea683705501eae82d32667adc92')
    .then(console.log);
    > true


------------------------------------------------------------------------------

getSymKey
=====================

.. code-block:: javascript

    web3.shh.getSymKey(id, [callback])

Returns the symmetric key associated with the given ID.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newKeyPair`` and ``shh.addPrivateKey``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - The raw symmetric key on success and an error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.getSymKey('af33b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > "0xa82a520aff70f7a989098376e48ec128f25f767085e84d7fb995a9815eebff0a"


------------------------------------------------------------------------------

deleteSymKey
=====================

.. code-block:: javascript

    web3.shh.deleteSymKey(id, [callback])

Deletes the symmetric key associated with the given ID.

----------
Parameters
----------

1. ``String`` - The key pair ID, returned by the creation functions (``shh.newKeyPair`` and ``shh.addPrivateKey``).
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Boolean`` - ``true`` on if the symmetric key was deleted, error on failure.


-------
Example
-------


.. code-block:: javascript

    web3.shh.deleteSymKey('bf31b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f')
    .then(console.log);
    > true


------------------------------------------------------------------------------


post
=====================

.. code-block:: javascript

   web3.shh.post(object [, callback])

This method should be called, when we want to post whisper a message to the network.

----------
Parameters
----------

1. ``Object`` - The post object:
    - ``symKeyID`` - ``String`` (optional): ID of symmetric key for message encryption (Either ``symKeyID`` or ``pubKey`` must be present. Can not be both.).
    - ``pubKey`` - ``String`` (optional): The public key for message encryption (Either ``symKeyID`` or ``pubKey`` must be present. Can not be both.).
    - ``sig`` - ``String`` (optional): The ID of the signing key.
    - ``ttl`` - ``Number``: Time-to-live in seconds.
    - ``topic`` - ``String``: 4 Bytes (mandatory when key is symmetric): Message topic.
    - ``payload`` - ``String``: The payload of the message to be encrypted.
    - ``padding`` - ``Number`` (optional): Padding (byte array of arbitrary length).
    - ``powTime`` - ``Number`` (optional)?: Maximal time in seconds to be spent on proof of work.
    - ``powTarget`` - ``Number`` (optional)?: Minimal PoW target required for this message.
    - ``targetPeer`` - ``Number`` (optional): Peer ID (for peer-to-peer message only).
2. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------

``Promise`` - returns a promise. Upon success, the ``then`` function will be passed a string representing the hash of the sent message. On error, the ``catch`` function will be passed a string containing the reason for the error.


-------
Example
-------

.. code-block:: javascript

    var identities = [];
    var subscription = null;

    Promise.all([
        web3.shh.newSymKey().then((id) => {identities.push(id);}),
        web3.shh.newKeyPair().then((id) => {identities.push(id);})

    ]).then(() => {

        // will receive also its own message send, below
        subscription = shh.subscribe("messages", {
            symKeyID: identities[0],
            topics: ['0xffaadd11']
        }).on('data', console.log);

    }).then(() => {
       web3.shh.post({
            symKeyID: identities[0], // encrypts using the sym key ID
            sig: identities[1], // signs the message using the keyPair ID
            ttl: 10,
            topic: '0xffaadd11',
            payload: '0xffffffdddddd1122',
            powTime: 3,
            powTarget: 0.5
        }).then(h => console.log(`Message with hash ${h} was successfuly sent`))
        .catch(err => console.log("Error: ", err));
    });



------------------------------------------------------------------------------


subscribe
=====================

.. code-block:: javascript

    web3.shh.subscribe('messages', options [, callback])

Subscribe for incoming whisper messages.


.. _shh-subscribeoptions:

----------
Parameters
----------

1. ``"messages"`` - ``String``: Type of the subscription.
2. ``Object`` - The subscription options:
    - ``symKeyID`` - ``String``: ID of symmetric key for message decryption.
    - ``privateKeyID`` - ``String``: ID of private (asymmetric) key for message decryption.
    - ``sig`` - ``String`` (optional): Public key of the signature, to verify.
    - ``topics``- ``Array`` (optional when "privateKeyID" key is given): Filters messages by this topic(s). Each topic must be a 4 bytes HEX string.
    - ``minPow`` - ``Number`` (optional): Minimal PoW requirement for incoming messages.
    - ``allowP2P`` - ``Boolean`` (optional):  Indicates if this filter allows processing of direct peer-to-peer messages (which are not to be forwarded any further, because they might be expired). This might be the case in some very rare cases, e.g. if you intend to communicate to MailServers, etc.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second. Will be called for each incoming subscription, and the subscription itself as 3 parameter.


.. _shh-subscribenotificationreturns:

----------
Notification Returns
----------

``Object`` - The incoming message:

    - ``hash`` - ``String``: Hash of the enveloped message.
    - ``sig`` - ``String``: Public key which signed this message.
    - ``recipientPublicKey`` - ``String``: The recipients public key.
    - ``timestamp`` - ``String``: Unix timestamp of the message genertion.
    - ``ttl`` -  ``Number``: Time-to-live in seconds.
    - ``topic`` - ``String``: 4 Bytes HEX string message topic.
    - ``payload`` - ``String``: Decrypted payload.
    - ``padding`` - ``Number``: Optional padding (byte array of arbitrary length).
    - ``pow`` -  ``Number``: Proof of work value.


----------
Example
----------

.. code-block:: javascript

    web3.shh.subscribe('messages', {
        symKeyID: 'bf31b9ffc2387e18636e0a3d0c56b023264c16e78a2adcba1303cefc685e610f',
        sig: '0x04d1574d4eab8f3dde4d2dc7ed2c4d699d77cbbdd09167b8fffa099652ce4df00c4c6e0263eafe05007a46fdf0c8d32b11aeabcd3abbc7b2bc2bb967368a68e9c6',
        ttl: 20,
        topics: ['0xffddaa11'],
        minPow: 0.8,
    }, function(error, message, subscription){

        console.log(message);
        > {
            "hash": "0x4158eb81ad8e30cfcee67f20b1372983d388f1243a96e39f94fd2797b1e9c78e",
            "padding": "0xc15f786f34e5cef0fef6ce7c1185d799ecdb5ebca72b3310648c5588db2e99a0d73301c7a8d90115a91213f0bc9c72295fbaf584bf14dc97800550ea53577c9fb57c0249caeb081733b4e605cdb1a6011cee8b6d8fddb972c2b90157e23ba3baae6c68d4f0b5822242bb2c4cd821b9568d3033f10ec1114f641668fc1083bf79ebb9f5c15457b538249a97b22a4bcc4f02f06dec7318c16758f7c008001c2e14eba67d26218ec7502ad6ba81b2402159d7c29b068b8937892e3d4f0d4ad1fb9be5e66fb61d3d21a1c3163bce74c0a9d16891e2573146aa92ecd7b91ea96a6987ece052edc5ffb620a8987a83ac5b8b6140d8df6e92e64251bf3a2cec0cca",
            "payload": "0xdeadbeaf",
            "pow": 0.5371803278688525,
            "recipientPublicKey": null,
            "sig": null,
            "timestamp": 1496991876,
            "topic": "0x01020304",
            "ttl": 50
        }
    })
    // or
    .on('data', function(message){ ... });


------------------------------------------------------------------------------


clearSubscriptions
=====================

.. code-block:: javascript

    web3.shh.clearSubscriptions()

Resets subscriptions.

.. note:: This will not reset subscriptions from other packages like ``web3-eth``, as they use their own requestManager.

----------
Parameters
----------

1. ``Boolean``: If ``true`` it keeps the ``"syncing"`` subscription.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    web3.shh.subscribe('messages', {...} ,function(){ ... });

    ...

    web3.shh.clearSubscriptions();


------------------------------------------------------------------------------


newMessageFilter
=====================

.. code-block:: javascript

    web3.shh.newMessageFilter(options)

Create a new filter within the node. This filter can be used to poll for new messages that match the set of criteria.


----------
Parameters
----------

1. ``Object``: See :ref:`web3.shh.subscribe() options <shh-subscribeoptions>` for details.

-------
Returns
-------

``String``: The filter ID.

-------
Example
-------

.. code-block:: javascript

    web3.shh.newMessageFilter()
    .then(console.log);
    > "2b47fbafb3cce24570812a82e6e93cd9e2551bbc4823f6548ff0d82d2206b326"

------------------------------------------------------------------------------


deleteMessageFilter
=====================

.. code-block:: javascript

    web3.shh.deleteMessageFilter(id)

Deletes a message filter in the node.

----------
Parameters
----------

1. ``String``: The filter ID created with ``shh.newMessageFilter()``.

-------
Returns
-------

``Boolean``: ``true`` on success, error on failure.

-------
Example
-------

.. code-block:: javascript

    web3.shh.deleteMessageFilter('2b47fbafb3cce24570812a82e6e93cd9e2551bbc4823f6548ff0d82d2206b326')
    .then(console.log);
    > true


------------------------------------------------------------------------------


getFilterMessages
=====================

.. code-block:: javascript

    web3.shh.getFilterMessages(id)

Retrieve messages that match the filter criteria and are received between the last time this function was called and now.

----------
Parameters
----------

1. ``String``: The filter ID created with ``shh.newMessageFilter()``.

-------
Returns
-------

``Array``: Returns an array of message objects like :ref:`web3.shh.subscribe() notification returns <shh-subscribenotificationreturns>`

-------
Example
-------

.. code-block:: javascript

    web3.shh.getFilterMessages('2b47fbafb3cce24570812a82e6e93cd9e2551bbc4823f6548ff0d82d2206b326')
    .then(console.log);
    > [{
        "hash": "0x4158eb81ad8e30cfcee67f20b1372983d388f1243a96e39f94fd2797b1e9c78e",
        "padding": "0xc15f786f34e5cef0fef6ce7c1185d799ecdb5ebca72b3310648c5588db2e99a0d73301c7a8d90115a91213f0bc9c72295fbaf584bf14dc97800550ea53577c9fb57c0249caeb081733b4e605cdb1a6011cee8b6d8fddb972c2b90157e23ba3baae6c68d4f0b5822242bb2c4cd821b9568d3033f10ec1114f641668fc1083bf79ebb9f5c15457b538249a97b22a4bcc4f02f06dec7318c16758f7c008001c2e14eba67d26218ec7502ad6ba81b2402159d7c29b068b8937892e3d4f0d4ad1fb9be5e66fb61d3d21a1c3163bce74c0a9d16891e2573146aa92ecd7b91ea96a6987ece052edc5ffb620a8987a83ac5b8b6140d8df6e92e64251bf3a2cec0cca",
        "payload": "0xdeadbeaf",
        "pow": 0.5371803278688525,
        "recipientPublicKey": null,
        "sig": null,
        "timestamp": 1496991876,
        "topic": "0x01020304",
        "ttl": 50
    },{...}]


