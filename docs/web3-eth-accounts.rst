.. _eth-accounts:


=========
web3.eth.accounts
=========

The ``web3.eth.accounts`` contains functions to generate Ethereum accounts and sign transactions.


------------------------------------------------------------------------------

.. _accounts-new:

new
=====================

.. code-block:: javascript

    web3.eth.accounts.new([entropy]);

Generates an account object with private key and public key.

----------
Parameters
----------

1. ``entropy`` - ``String`` (optional): A random strong to increase entropy. If given it should be at least 32 characters. If none is given a random string will be generated using :ref:`randomhex <randomhex>`.

.. _eth-accounts-generate-return:

-------
Returns
-------

``Object`` - The account object with the following structure:

    - ``address`` - ``string``: The account address.
    - ``publicKey`` - ``string``: The accounts public key.
    - ``privateKey`` - ``string``: The accounts private key. This should never be shared or stored unencrypted in localstorage! Also make sure to ``null`` the memory after usage.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.new();
    > {
        address: "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01",
        publicKey: "0xbb1846722a4c27e71196e1a44611ee7174276a6c51c4830fb810cac64b0725f217cb8783625a809d1303adeeec2cf036ab74098a77a6b7f1003486e173b29aa7"
        privateKey: "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709",
    }

    web3.eth.accounts.new('2435@#@#@±±±±!!!!678543213456764321§34567543213456785432134567');
    > {
        address: "0xF2CD2AA0c7926743B1D4310b2BC984a0a453c3d4",
        publicKey: "0x0b9f65726c43d486229d0a44f27edb53a0e4b141350ceaa8f7a12c893e5b0385b3b25b35b1a0b85d39e2b7e8f1b407f776f0fc765be04683dea4697a3c603a46"
        privateKey: "0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098",
    }

    web3.eth.accounts.generate(web3.utils.randomHex(32));
    > {
        address: "0xe78150FaCD36E8EB00291e251424a0515AA1FF05",
        publicKey: "0x03ade6efb5848276b2ed4185f2523fabaec2443c42c5f648ca3a419d5234dcd03ee22333104be64df1b6db1536591b00cd425b7e13d45c75cea857cf1d4861f7"
        privateKey: "0xcc505ee6067fba3f6fc2050643379e190e087aeffe5d958ab9f2f3ed3800fa4e",
    }

------------------------------------------------------------------------------


privateToAccount
=====================

.. code-block:: javascript

    web3.eth.accounts.privateToAccount(privateKey);

Gets a account object from a private key.

----------
Parameters
----------

1. ``privateKey`` - ``String``: The private key to convert.

-------
Returns
-------

``Object`` - The account object with the :ref:`structure seen here <eth-accounts-generate-return>`.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.privateToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > {
        privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
        publicKey: '0xbb1846722a4c27e71196e1a44611ee7174276a6c51c4830fb810cac64b0725f217cb8783625a809d1303adeeec2cf036ab74098a77a6b7f1003486e173b29aa7',
        address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'
    }

    web3.eth.accounts.privateToAccount('348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > {
        privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
        publicKey: '0xbb1846722a4c27e71196e1a44611ee7174276a6c51c4830fb810cac64b0725f217cb8783625a809d1303adeeec2cf036ab74098a77a6b7f1003486e173b29aa7',
        address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'
    }


------------------------------------------------------------------------------


publicToAddress
=====================

.. code-block:: javascript

    web3.eth.accounts.publicToAddress(publicKey);

Gets an Ethereum address from a public key.

----------
Parameters
----------

1. ``publicKey`` - ``String``: The public key to convert.

-------
Returns
-------

``String`` - The Ethereum address.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.publicToAddress('0x7195981eaa1ccf18c6d2e15ca5c5bc6ad97f7f8e3505005f9ad12fc68a02ded647f95b9cacf71a2a99f96371c6133dfd3d4486493d9159d49a7faae7c5793c24');
    > "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55"

    web3.eth.accounts.publicToAddress('7195981eaa1ccf18c6d2e15ca5c5bc6ad97f7f8e3505005f9ad12fc68a02ded647f95b9cacf71a2a99f96371c6133dfd3d4486493d9159d49a7faae7c5793c24');
    > "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55"



------------------------------------------------------------------------------


// TODO ----------------------------------------


signTransaction
=====================

.. code-block:: javascript

    web3.eth.accounts.signTransaction(tx, privateKey [, returnSignature] [, callback]);

Signs a ethereum transaction with a given private key.

----------
Parameters
----------

1. ``tx`` - ``Object``: The transaction object as follows:
    - ``nonce`` - ``String``: (optional) The nonce to use when signing this transaction. Default will use :ref:`web3.eth.getTransactionCount() <eth-gettransactioncount>`.
    - ``chainId`` - ``String``: (optional) The chain id to use when signing this transaction. Default will use :ref:`web3.eth.net.getId() <net-getid>`.
    - ``to`` - ``String``: (optional) The recevier of the transaction, can be empty when deploying a contract.
    - ``data`` - ``String``: (optional) The call data of the transaction, can be empty for simple value transfers.
    - ``value`` - ``String``: (optional) The value of the transaction in wei.
    - ``gas`` - ``String``: The gas provided by the transaction.
    - ``gasPrice`` - ``String``: (optional) The gas price set by this transaction, if empty, it will use :ref:`web3.eth.gasPrice() <eth-gasprice>`
2. ``privateKey`` - ``String``: The private key for signing.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------

``String|Object``: The signed data RLP encoded transaction, or if ``returnSignature`` is ``true`` the signature values as follows:
    - ``message`` - ``String``: The the given message.
    - ``hash`` - ``String``: The hash of the given message.
    - ``r`` - ``String``: first 2 ??? bytes of ????
    - ``s`` - ``String``: first 2 ??? bytes of ????
    - ``v`` - ``String``: first 2 ??? bytes of ????

.. note:: If ``nonce``, ``chainId``, ``gas`` and ``gasPrice`` is given, it returns synchronous with the signed transaction.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.signTransaction({
        to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        value: '1000000000',
        gas: 2000000
    }, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
    .then(console.log);
    > "0xf86180808401ef364594f0109fc8df283027b6285cc889f5aa624eac1f5580801ca031573280d608f75137e33fc14655f097867d691d5c4c44ebe5ae186070ac3d5ea0524410802cdc025034daefcdfa08e7d2ee3f0b9d9ae184b2001fe0aff07603d9"

    // if nonce, chainId, gas and gasPrice is given it returns synchronous
    web3.eth.accounts.signTransaction({
        to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        value: '1000000000',
        gas: 2000000,
        gasPrice: '234567897654321',
        nonce: 0,
        chainId: 1
    }, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
    > "0xf86180808401ef364594f0109fc8df283027b6285cc889f5aa624eac1f5580801ca031573280d608f75137e33fc14655f097867d691d5c4c44ebe5ae186070ac3d5ea0524410802cdc025034daefcdfa08e7d2ee3f0b9d9ae184b2001fe0aff07603d9"



------------------------------------------------------------------------------

recoverTransaction
=====================

.. code-block:: javascript

    web3.eth.accounts.recoverTransaction(signature);

Recovers the Ethereum address which was used to sign the given RLP encoded transaction.

----------
Parameters
----------

1. ``signature`` - ``String|Object``: The RLP encoded transaction.  Or a signature object with hash, r, s, v properties.


-------
Returns
-------

``String``: The Ethereum address used to sign this transaction.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.recoverTransaction('0xf86180808401ef364594f0109fc8df283027b6285cc889f5aa624eac1f5580801ca031573280d608f75137e33fc14655f097867d691d5c4c44ebe5ae186070ac3d5ea0524410802cdc025034daefcdfa08e7d2ee3f0b9d9ae184b2001fe0aff07603d9');
    > "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55"



------------------------------------------------------------------------------

sign
=====================

.. code-block:: javascript

    web3.eth.accounts.recoverTransaction(data, privateKey [, returnSignature]);

Recovers the Ethereum address which was used to sign the given RLP encoded transaction.

----------
Parameters
----------

1. ``signature`` - ``String``: The RLP encoded transaction.
2. ``privateKey`` - ``String``: The private key for signing.
3. ``returnSignature`` - ``Boolean``: If true it returns an object with r, v, s and hash properties.


-------
Returns
-------

``String|Object``: The signed data RLP encoded signature, or if ``returnSignature`` is ``true`` the signature values as follows:
    - ``message`` - ``String``: The the given message.
    - ``hash`` - ``String``: The hash of the given message.
    - ``r`` - ``String``: first 2 ??? bytes of ????
    - ``s`` - ``String``: first 2 ??? bytes of ????
    - ``v`` - ``String``: first 2 ??? bytes of ????

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.recoverTransaction('Some data', '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318');
    > "0xdd6180808401ef364594f0109fc8df283027b6285cc889f5aa624eac1f5580801ca031573280d608f75137e33fc14655f097867d691d5c4c44ebe5ae186070ac3d5ea0524410802cdc025034daefcdfa08e7d2ee3f0b9d9ae184b2001fe0aff07603d9"



------------------------------------------------------------------------------

recover
=====================

.. code-block:: javascript

    web3.eth.accounts.recover(signature);

Recovers the Ethereum address which was used to sign the given data.

----------
Parameters
----------

1. ``signature`` - ``String|Object``: The RLP (?) encoded signed data. Or a signature object with hash, r, s, v properties.


-------
Returns
-------

``String``: The Ethereum address used to sign this transaction.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.recover('0xdd6180808401ef364594f0109fc8df283027b6285cc889f5aa624eac1f5580801ca031573280d608f75137e33fc14655f097867d691d5c4c44ebe5ae186070ac3d5ea0524410802cdc025034daefcdfa08e7d2ee3f0b9d9ae184b2001fe0aff07603d9');
    > "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55"



------------------------------------------------------------------------------


encrypt
=====================

.. code-block:: javascript

    web3.eth.accounts.encrypt(privateKey, password);

Encrypts a private key using ???

----------
Parameters
----------

1. ``privateKey`` - ``String``: The private key to encrypt.
2. ``password`` - ``String``: The password used for encryption.


-------
Returns
-------

``String``: The encrypted privatekey.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.encrypt('0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318', 'test!$@');
    > "0b5dbb6204fe512x4c0883a69102937d62314719617082792x4c0883a69102937d6231471ae468d01a3f362318"



------------------------------------------------------------------------------

decrypt
=====================

.. code-block:: javascript

    web3.eth.accounts.decrypt(encryptedPrivateKey, password);

Encrypts a private key using ???

----------
Parameters
----------

1. ``encryptedPrivateKey`` - ``String``: The encrypted private key to decrypt.
2. ``password`` - ``String``: The password used for encryption.


-------
Returns
-------

``String``: The decrypted privatekey.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.decrypt('0b5dbb6204fe512x4c0883a69102937d62314719617082792x4c0883a69102937d6231471ae468d01a3f362318', 'test!$@');
    > "0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318"



------------------------------------------------------------------------------

wallet
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet;

Contains an in memory wallet with multiple accounts. These accounts can be used when using :ref:`web3.eth.sendTransaction <eth-sendtransaction>`.

?? Should we allow multiple wallets? How sendTransaction knows then which to use?

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet;
    > Wallet {
        0: {...},
        1: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...},
        "0xD0122fC8DF283027b6285cc889F5aA624EaC1d23": {...}
        add: function(){},
        remove: function(){},
        save: function(){},
        load: function(){},
        clear: function(){}
    }



------------------------------------------------------------------------------

wallet.new
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.new(numberOfAccounts [, entropy]);

Generates one or more accounts in the wallet.

----------
Parameters
----------

1. ``numberOfAccounts`` - ``Number``: Number of accounts to create. Leave empty to create an empty wallet.
2. ``entropy`` - ``String``: (optional) A string with random characters as additional entropy when generating accounts. If given it should be at least 32 characters.


-------
Returns
-------

``Object``: The wallet object.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet.new(2, '54674321§3456764321§345674321§3453647544±±±§±±±!!!43534534534534');
    > Wallet {
        0: {...},
        1: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...},
        "0xD0122fC8DF283027b6285cc889F5aA624EaC1d23": {...}
        ...
    }



------------------------------------------------------------------------------

wallet.add
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.add(account);

Adds an account using a private key or account object to the wallet.

----------
Parameters
----------

1. ``account`` - ``String|Object``: A private key or account object created with :ref:`web3.eth.accounts.new() <accounts-new>`.


-------
Returns
-------

``Object``: The wallet object.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet.add('0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318');
    > Wallet {
        0: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...}
        ...
    }

    web3.eth.accounts.wallet.add({
        privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
        publicKey: '0xbb1846722a4c27e71196e1a44611ee7174276a6c51c4830fb810cac64b0725f217cb8783625a809d1303adeeec2cf036ab74098a77a6b7f1003486e173b29aa7',
        address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01'
    });
    > Wallet {
        0: {...},
        "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01": {...}
        ...
    }



------------------------------------------------------------------------------

wallet.remove
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.remove(account);

Removes an securely account from the wallet.

----------
Parameters
----------

1. ``account`` - ``String|Number``: The account address, or index in the wallet.


-------
Returns
-------

``Object``: The wallet object.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet;
    > Wallet {
        0: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...}
        1: {...},
        "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01": {...}
        ...
    }

    web3.eth.accounts.wallet.remove('0xF0109fC8DF283027b6285cc889F5aA624EaC1F55');
    > Wallet {
        1: {...},
        "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01": {...}
        ...
    }

    web3.eth.accounts.wallet.remove(1);
    > Wallet {
        ...
    }



------------------------------------------------------------------------------

wallet.save
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.save(password [, keyName]);

Stores the wallet encrypted in local storage.

----------
Parameters
----------

1. ``password`` - ``String``: The password to encrypt the wallet.
2. ``keyName`` - ``String``: (optional) The key used for the localstorage position, defaults to ``"web3js_wallet"``.


-------
Returns
-------

``String``: The stringified and encrypted wallet.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet.save('test#!$', 'myWalletKey');
    > '634534562534412426573645312443567753214567432145674321456784321345678543213456' ??



------------------------------------------------------------------------------

wallet.load
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.load(password [, keyName]);

Loads the wallet and decrypt it from local storage.

----------
Parameters
----------

1. ``password`` - ``String``: The password to decrypt the wallet.
2. ``keyName`` - ``String``: (optional) The key used for the localstorage position, defaults to ``"web3js_wallet"``.


-------
Returns
-------

``Object``: The wallet object.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet.load('test#!$', 'myWalletKey');
    > Wallet {
        0: {...},
        1: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...},
        "0xD0122fC8DF283027b6285cc889F5aA624EaC1d23": {...}
        ...
    }



------------------------------------------------------------------------------

wallet.clear
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.clear();

Securely empties the wallet and removes the keys.

----------
Parameters
----------

none

-------
Returns
-------

``Object``: The wallet object.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.wallet;
    > Wallet {
        0: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...}
        1: {...},
        "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01": {...}
        ...
    }

    web3.eth.accounts.wallet.clear();
    > Wallet {
        ...
    }



------------------------------------------------------------------------------
