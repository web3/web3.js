.. _eth-personal:

.. include:: include_announcement.rst

========
web3.eth.personal
========


The ``web3-eth-personal`` package allows you to interact with the Ethereum node's accounts.

.. note:: Many of these functions send sensitive information, like password. Never call these functions over a unsecured Websocket or HTTP provider, as your password will be send in plain text!


.. code-block:: javascript

    var Personal = require('web3-eth-personal');

    // "Personal.providers.givenProvider" will be set if in an Ethereum supported browser.
    var personal = new Personal(Personal.givenProvider || 'ws://some.local-or-remote.node:8546');


    // or using the web3 umbrella package

    var Web3 = require('web3');
    var web3 = new Web3(Web3.givenProvider || 'ws://some.local-or-remote.node:8546');

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

``Promise`` returns ``String``: The address of the newly created account.

-------
Example
-------

.. code-block:: javascript

    web3.eth.personal.newAccount('!@superpassword')
    .then(console.log);
    > '0x1234567891011121314151617181920212223456'

------------------------------------------------------------------------------


sign
=====================

.. code-block:: javascript

    web3.eth.personal.sign(dataToSign, address, password [, callback])

Signs data using a specific account.

.. note:: Sending your account password over an unsecured HTTP RPC connection is highly unsecure.

----------
Parameters
----------


1. ``String`` - Data to sign. If String it will be converted using :ref:`web3.utils.utf8ToHex <utils-utf8tohex>`.
2. ``String`` - Address to sign data with.
3. ``String`` - The password of the account to sign data with.
4. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise`` returns ``String`` - The signature.


-------
Example
-------


.. code-block:: javascript

    web3.eth.personal.sign("Hello world", "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
    .then(console.log);
    > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"

    // the below is the same
    web3.eth.personal.sign(web3.utils.utf8ToHex("Hello world"), "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "test password!")
    .then(console.log);
    > "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"


------------------------------------------------------------------------------


ecRecover
=====================

.. code-block:: javascript

    web3.eth.personal.ecRecover(dataThatWasSigned, signature [, callback])

Recovers the account that signed the data.

----------
Parameters
----------


1. ``String`` - Data that was signed. If String it will be converted using :ref:`web3.utils.utf8ToHex <utils-utf8tohex>`.
2. ``String`` - The signature.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise`` returns ``String`` - The account.


-------
Example
-------


.. code-block:: javascript

    web3.eth.personal.ecRecover("Hello world", "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400").then(console.log);
    > "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"

------------------------------------------------------------------------------

// TODO

getAccounts, unlockAccount, lockAccount, sendTransaction
