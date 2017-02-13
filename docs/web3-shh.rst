========
web3.shh
========

.. note:: this API is not final yet!!


The ``web3-shh`` package allows you to interact with an the whisper protocol for broadcasting.
For more see `Whisper  Overview <https://github.com/ethereum/wiki/wiki/Whisper-Overview>`_.


.. code-block:: javascript

    var Shh = require('web3-shh');

    // "Shh.providers.givenProvider" will be set if in an Ethereum supported browser.
    var shh = new Shh(Shh.providers.givenProvider || new Shh.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.providers.givenProvider || new Web3.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));

    // -> web3.shh


------------------------------------------------------------------------------


.. include:: package-core.rst



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
  - ``String`` 60 Bytes - ``from`` (optional): The identity of the sender.
  - ``String`` 60 Bytes - ``to`` (optional): The identity of the receiver. When present whisper will encrypt the message so that only the receiver can decrypt it.
  - ``Array`` - ``topics``: Array of topics ``Strings``, for the receiver to identify messages.
  - ``String|Number|Object`` - ``payload``: The payload of the message. Will be autoconverted to a HEX string before.
  - ``Number`` - ``ttl``: Integer of the time to live in seconds.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------

``Boolean`` - returns ``true`` if the message was send, otherwise ``false``.


-------
Example
-------

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

1. ``String``: Type ``"messages"``.
1. ``Object`` - The filter options:
  - ``Array``- ``topics``: Filters messages by this topic(s). You can use the following combinations:
    - `['topic1', 'topic2'] == 'topic1' && 'topic2'`
    - `['topic1', ['topic2', 'topic3']] == 'topic1' && ('topic2' || 'topic3')`
    - `[null, 'topic1', 'topic2'] == ANYTHING && 'topic1' && 'topic2'` -> ``null`` works as a wildcard
  - ``String`` - ``to``: Filter by identity of the message receiver. If provided and the node has this identity, it will decrypt the incoming encrypted messages.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


----------
Callback Return
----------

``Object`` - The incoming message:

  - ``String`` 60 Bytes - ``from``: The sender of the message, if a sender was specified.
  - ``String`` 60 Bytes - ``to``: The receiver of the message, if a receiver was specified.
  - ``Number`` - ``expiry``: Integer of the time in seconds when this message should expire (?).
  - ``Number`` -  ``ttl``: Integer of the time the message should float in the system in seconds (?).
  - ``Number`` -  ``sent``: Integer of the unix timestamp when the message was sent.
  - ``Array`` - ``topics``: topic ``Strings`` for the message.
  - ``String`` - ``payload``: The payload of the message.
  - ``Number`` - ``workProved``: Integer of the work this message required before it was send (?).


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


