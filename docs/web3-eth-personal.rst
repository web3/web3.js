.. _eth-personal:

========
web3.eth.personal
========


The ``web3-eth-personal`` package allows you to interact with the Ethereum node's accounts.

.. note:: Many of these functions send sensitive information, like password. Never call these functions over a unsecured Websocket or HTTP provider, as your password will be send in plain text!


.. code-block:: javascript

    var Personal = require('web3-eth-personal');

    // "Personal.providers.givenProvider" will be set if in an Ethereum supported browser.
    var personal = new Personal(Personal.givenProvider || new Personal.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://some.local-or-remote.node:8546'));

    // -> web3.eth.personal


------------------------------------------------------------------------------


.. include:: include_package-core.rst



------------------------------------------------------------------------------



newAccount
=========

.. code-block:: javascript

    web3.eth.personal.newAccount(password, [callback])

Creates a new account.

.. note:: Never call this function over a unsecured Websocket or HTTP provider, as your password will be send in plain text!

----------
Parameters
----------

1. ``password`` - ``String``: The password to encrypt this account with.

-------
Returns
-------

``Promise`` returns ``Boolean``: ``true`` if the account was created, otherwise ``false``.

-------
Example
-------

.. code-block:: javascript

    web3.eth.personal.newAccount('!@superpassword')
    .then(console.log);
    > true

------------------------------------------------------------------------------

// TODO
