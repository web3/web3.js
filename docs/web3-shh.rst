.. _shh:

.. include:: include_announcement.rst

========
web3.shh
========

.. note:: this API is not final yet!!


The ``web3-shh`` package allows you to interact with an the whisper protocol for broadcasting.
For more see `Whisper  Overview <https://github.com/ethereum/go-ethereum/wiki/Whisper>`_.


.. code-block:: javascript

    var Shh = require('web3-shh');

    // "Shh.providers.givenProvider" will be set if in an Ethereum supported browser.
    var shh = new Shh(Shh.givenProvider || new Shh.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));

    // -> web3.shh


------------------------------------------------------------------------------


.. include:: include_package-core.rst



------------------------------------------------------------------------------


.. include:: include_package-net.rst


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

``Boolean`` - returns ``true`` if the message was send, otherwise ``false`` or error.


-------
Example
-------

// TODO continue here

.. code-block:: javascript

    var identity = web3.shh.newIdentity();
    var topic = 'example';
    var payload = 'hello whisper world!';

    var message = {
      from: identity,
      topics: [topic],
      payload: payload,
      ttl: 100
    };

    web3.shh.post(message);


------------------------------------------------------------------------------

newIdentity
=====================

.. code-block:: javascript

    web3.shh.newIdentity([callback])

Should be called to create new a identity.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``String`` - A new identity HEX string.


-------
Example
-------


.. code-block:: javascript

    web3.shh.newIdentity();
    > "0xc931d93e97ab07fe42d923478ba2465f283f440fd6cabea4dd7a2c807108f651b7135d1d6ca9007d5b68aa497e4619ac10aa3b27726e1863c1fd9b570d99bbaf"


------------------------------------------------------------------------------

hasIdentity
=====================

.. code-block:: javascript

    web3.shh.hasIdentity(identity, [callback])

Should be called, if we want to check if user has given identity.

----------
Parameters
----------

1. ``String`` - The identity to check.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Boolean`` - returns ``true`` if the identity exists, otherwise ``false``.


-------
Example
-------


.. code-block:: javascript

    var identity = web3.shh.newIdentity();
    web3.shh.hasIdentity(identity);
    > true

    web3.shh.hasIdentity(identity + "0");
    > false


------------------------------------------------------------------------------

subscribe
=====================

.. code-block:: javascript

    web3.shh.subscribe('messages', options, callback)

Watch for incoming whisper messages.

----------
Parameters
----------

1. ``"messages"`` - ``String``: Type of the subscription.
2. ``Object`` - The filter options:
  - ``topics``- ``Array``: Filters messages by this topic(s). You can use the following combinations:
    - ``['topic1', 'topic2'] == 'topic1' && 'topic2'``
    - ``['topic1', ['topic2', 'topic3']] == 'topic1' && ('topic2' || 'topic3')``
    - ``[null, 'topic1', 'topic2'] == ANYTHING && 'topic1' && 'topic2'`` -> ``null`` works as a wildcard
  - ``to`` - ``String``: Filter by identity of the message receiver. If provided and the node has this identity, it will decrypt the incoming encrypted messages.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.


----------
Callback Return
----------

``Object`` - The incoming message:

  - ``from`` - 60 Bytes ``String``: The sender of the message, if a sender was specified.
  - ``to`` - 60 Bytes ``String``: The receiver of the message, if a receiver was specified.
  - ``expiry`` - ``Number``: Integer of the time in seconds when this message should expire (?).
  - ``ttl`` -  ``Number``: Integer of the time the message should float in the system in seconds (?).
  - ``sent`` -  ``Number``: Integer of the unix timestamp when the message was sent.
  - ``topics`` - ``Array``: topic ``Strings`` for the message.
  - ``payload`` - ``String``: The payload of the message.
  - ``workProved`` - ``Number``: Integer of the work this message required before it was send (?).


----------
Example
----------

.. code-block:: javascript

    web3.shh.subscribe('messages', {
        to: '0xc931d93e97ab07fe42d923478ba2465f283f440fd6cabea4dd7a2c807108f651b7135d1d6ca9007d5b68aa497e4619ac10aa3b27726e1863c1fd9b570d99bbaf',
        ttl: 2000,
        topics: ['0x123456']
    }, function(error, message){

        ...
    })

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

none

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    web3.shh.subscribe('messages', {} ,function(){ ... });

    ...

    web3.shh.clearSubscriptions();


