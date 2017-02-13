========
web3.shh
========


The ``web3-shh`` package allows you to interact with an the whisper protocol for broadcasting.

-------
Example
-------

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

### web3.shh

[Whisper  Overview](https://github.com/ethereum/wiki/wiki/Whisper-Overview)

-------
Example
-------


.. code-block:: javascript

var shh = web3.shh;


------------------------------------------------------------------------------

web3.shh.post
=====================

   web3.shh.post(object [, callback])

This method should be called, when we want to post whisper message to the network.

----------
Parameters
----------

1. ``Object`` - The post object:
  - ``from``: ``String``, 60 Bytes HEX - (optional) The identity of the sender.
  - ``to``: ``String``, 60 Bytes  HEX - (optional) The identity of the receiver. When present whisper will encrypt the message so that only the receiver can decrypt it.
  - ``topics``: `Array of Strings` - Array of topics ``Strings``, for the receiver to identify messages.
  - ``payload``: ``"String|Number|Object"`` - The payload of the message. Will be autoconverted to a HEX string before.
  - ``priority``: ``Number`` - The integer of the priority in a rang from ... (?).
  - ``ttl``: ``Number`` - integer of the time to live in seconds.
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
  ttl: 100,
  workToProve: 100 // or priority TODO
};

web3.shh.post(message);


------------------------------------------------------------------------------

web3.shh.newIdentity
=====================

    web3.shh.newIdentity([callback])

Should be called to create new identity.

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

var identity = web3.shh.newIdentity();
console.log(identity); // "0xc931d93e97ab07fe42d923478ba2465f283f440fd6cabea4dd7a2c807108f651b7135d1d6ca9007d5b68aa497e4619ac10aa3b27726e1863c1fd9b570d99bbaf"


------------------------------------------------------------------------------

web3.shh.hasIdentity
=====================

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
var result = web3.shh.hasIdentity(identity);
console.log(result); // true

var result2 = web3.shh.hasIdentity(identity + "0");
console.log(result2); // false


------------------------------------------------------------------------------

web3.shh.newGroup
=====================

-------
Example
-------

.. code-block:: javascript

// TODO: not implemented yet


------------------------------------------------------------------------------

web3.shh.addToGroup
=====================

-------
Example
-------

.. code-block:: javascript

// TODO: not implemented yet


------------------------------------------------------------------------------

web3.shh.filter
=====================

.. code-block:: javascript

var filter = web3.shh.filter(options)

// watch for changes
filter.watch(function(error, result){
  if (!error)
    console.log(result);
});


Watch for incoming whisper messages.

----------
Parameters
----------

1. ``Object`` - The filter options:
  * ``topics``: `Array of Strings` - Filters messages by this topic(s). You can use the following combinations:
    - `['topic1', 'topic2'] == 'topic1' && 'topic2'`
    - `['topic1', ['topic2', 'topic3']] == 'topic1' && ('topic2' || 'topic3')`
    - `[null, 'topic1', 'topic2'] == ANYTHING && 'topic1' && 'topic2'` -> ``null`` works as a wildcard
  * ``to``: Filter by identity of receiver of the message. If provided and the node has this identity, it will decrypt incoming encrypted messages.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

##### Callback return

``Object`` - The incoming message:

  - ``from``: ``String``, 60 Bytes - The sender of the message, if a sender was specified.
  - ``to``: ``String``, 60 Bytes - The receiver of the message, if a receiver was specified.
  - ``expiry``: ``Number`` - Integer of the time in seconds when this message should expire (?).
  - ``ttl``: ``Number`` -  Integer of the time the message should float in the system in seconds (?).
  - ``sent``: ``Number`` -  Integer of the unix timestamp when the message was sent.
  - ``topics``: `Array of String` - Array of ``String`` topics the message contained.
  - ``payload``: ``String`` - The payload of the message.
  - ``workProved``: ``Number`` - Integer of the work this message required before it was send (?).
