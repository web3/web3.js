.. _eth-accounts:

.. include:: include_announcement.rst

=========
web3.eth.accounts
=========

The ``web3.eth.accounts`` contains functions to generate Ethereum accounts and sign transactions.


------------------------------------------------------------------------------

.. _accounts-create:

create
=====================

.. code-block:: javascript

    web3.eth.accounts.create([entropy]);

Generates an account object with private key and public key.

----------
Parameters
----------

1. ``entropy`` - ``String`` (optional): A random strong to increase entropy. If given it should be at least 32 characters. If none is given a random string will be generated using :ref:`randomhex <randomhex>`.

.. _eth-accounts-create-return:

-------
Returns
-------

``Object`` - The account object with the following structure:

    - ``address`` - ``string``: The account address.
    - ``privateKey`` - ``string``: The accounts private key. This should never be shared or stored unencrypted in localstorage! Also make sure to ``null`` the memory after usage.
    - ``signTransaction(tx [, callback])`` - ``Function``: The function to sign transactions. See :ref:`web3.eth.accounts.signTransaction() <eth-accounts-signtransaction>` for more.
    - ``sign(data)`` - ``Function``: The function to sign transactions. See :ref:`web3.eth.accounts.sign() <eth-accounts-sign>` for more.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.create();
    > {
        address: "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01",
        privateKey: "0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709",
        signTransaction: function(tx){...},
        sign: function(data){...}
    }

    web3.eth.accounts.create('2435@#@#@±±±±!!!!678543213456764321§34567543213456785432134567');
    > {
        address: "0xF2CD2AA0c7926743B1D4310b2BC984a0a453c3d4",
        privateKey: "0xd7325de5c2c1cf0009fac77d3d04a9c004b038883446b065871bc3e831dcd098",
        signTransaction: function(tx){...},
        sign: function(data){...}
    }

    web3.eth.accounts.create(web3.utils.randomHex(32));
    > {
        address: "0xe78150FaCD36E8EB00291e251424a0515AA1FF05",
        privateKey: "0xcc505ee6067fba3f6fc2050643379e190e087aeffe5d958ab9f2f3ed3800fa4e",
        signTransaction: function(tx){...},
        sign: function(data){...}
    }

------------------------------------------------------------------------------


privateKeyToAccount
=====================

.. code-block:: javascript

    web3.eth.accounts.privateKeyToAccount(privateKey);

Creates an account object from a private key.

----------
Parameters
----------

1. ``privateKey`` - ``String``: The private key to convert.

-------
Returns
-------

``Object`` - The account object with the :ref:`structure seen here <eth-accounts-create-return>`.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.privateKeyToAccount('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > {
        privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
        address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
        signTransaction: function(tx){...},
        sign: function(data){...}
    }

    web3.eth.accounts.privateKeyToAccount('348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > {
        privateKey: '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709',
        address: '0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01',
        signTransaction: function(tx){...},
        sign: function(data){...}
    }


------------------------------------------------------------------------------

.. _eth-accounts-signtransaction:

signTransaction
=====================

.. code-block:: javascript

    web3.eth.accounts.signTransaction(tx, privateKey [, callback]);

Signs an Ethereum transaction with a given private key.

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
2. ``privateKey`` - ``String``: The private key to sign with.
3. ``callback`` - ``Function``: (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------

``Promise|Object`` returning ``Object``: The signed data RLP encoded transaction, or if ``returnSignature`` is ``true`` the signature values as follows:
    - ``messageHash`` - ``String``: The hash of the given message.
    - ``r`` - ``String``: First 32 bytes of the signature
    - ``s`` - ``String``: Next 32 bytes of the signature
    - ``v`` - ``String``: Recovery value + 27
    - ``rawTransaction`` - ``String``: The RLP encoded transaction, ready to be send using :ref:`web3.eth.sendSignedTransaction <eth-sendsignedtransaction>`.

.. note:: If ``nonce``, ``chainId``, ``gas`` and ``gasPrice`` is given, it returns the signed transaction *directly* as ``Object``.

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
    > {
        messageHash: '0x88cfbd7e51c7a40540b233cf68b62ad1df3e92462f1c6018d6d67eae0f3b08f5',
        v: '0x25',
        r: '0xc9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895',
        s: '0x727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68',
        rawTransaction: '0xf869808504e3b29200831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a0c9cf86333bcb065d140032ecaab5d9281bde80f21b9687b3e94161de42d51895a0727a108a0b8d101465414033c3f705a9c7b826e596766046ee1183dbc8aeaa68'
    }

    // if nonce, chainId, gas and gasPrice is given it returns synchronous
    web3.eth.accounts.signTransaction({
        to: '0xF0109fC8DF283027b6285cc889F5aA624EaC1F55',
        value: '1000000000',
        gas: 2000000,
        gasPrice: '234567897654321',
        nonce: 0,
        chainId: 1
    }, '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318')
    > {
        messageHash: '0x6893a6ee8df79b0f5d64a180cd1ef35d030f3e296a5361cf04d02ce720d32ec5',
        r: '0x09ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9c',
        s: '0x440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428',
        v: '0x25',
        rawTransaction: '0xf86a8086d55698372431831e848094f0109fc8df283027b6285cc889f5aa624eac1f55843b9aca008025a009ebb6ca057a0535d6186462bc0b465b561c94a295bdb0621fc19208ab149a9ca0440ffd775ce91a833ab410777204d5341a6f9fa91216a6f3ee2c051fea6a0428'
    }



------------------------------------------------------------------------------


recoverTransaction
=====================

.. code-block:: javascript

    web3.eth.accounts.recoverTransaction(rawTransaction);

Recovers the Ethereum address which was used to sign the given RLP encoded transaction.

----------
Parameters
----------

1. ``signature`` - ``String``: The RLP encoded transaction.


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

hashMessage
=====================

.. code-block:: javascript

    web3.eth.accounts.hashMessage(message);

Hashes the given message to be passed :ref:`web3.eth.accounts.recover() <accounts-recover>` function. The data  will be UTF-8 HEX decoded and enveloped as follows: ``"\x19Ethereum Signed Message:\n" + message.length + message`` and hashed using keccak256.

----------
Parameters
----------

1. ``message`` - ``String``: A message to hash, if its HEX it will be UTF8 decoded before.


-------
Returns
-------

``String``: The hashed message

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.hashMessage("Hello World")
    > "0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2"

    // the below results in the same hash
    web3.eth.accounts.hashMessage(web3.utils.utf8ToHex("Hello World"))
    > "0xa1de988600a42c4b4ab089b619297c17d53cffae5d5120d82d8a92d0bb3b78f2"



------------------------------------------------------------------------------

.. _eth-accounts-sign:

sign
=====================

.. code-block:: javascript

    web3.eth.accounts.sign(data, privateKey);

Signs arbitrary data. This data is before UTF-8 HEX decoded and enveloped as follows: ``"\x19Ethereum Signed Message:\n" + message.length + message``.

----------
Parameters
----------

1. ``data`` - ``String``: The data to sign. If its a string it will be
2. ``privateKey`` - ``String``: The private key to sign with.


-------
Returns
-------

``String|Object``: The signed data RLP encoded signature, or if ``returnSignature`` is ``true`` the signature values as follows:
    - ``message`` - ``String``: The the given message.
    - ``messageHash`` - ``String``: The hash of the given message.
    - ``r`` - ``String``: First 32 bytes of the signature
    - ``s`` - ``String``: Next 32 bytes of the signature
    - ``v`` - ``String``: Recovery value + 27

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.sign('Some data', '0x4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318');
    > {
        message: 'Some data',
        messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
        v: '0x1c',
        r: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
        s: '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029',
        signature: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c'
    }



------------------------------------------------------------------------------

.. _accounts-recover:

recover
=====================

.. code-block:: javascript

    web3.eth.accounts.recover(signatureObject);
    web3.eth.accounts.recover(hash, signature);
    web3.eth.accounts.recover(hash, v, r, s);

Recovers the Ethereum address which was used to sign the given data.

----------
Parameters
----------

1. ``signature`` - ``String|Object``: Either the encoded signature, the v, r, s values as separate parameters, or an object with the following values:
    - ``messageHash`` - ``String``: The hash of the given message.
    - ``r`` - ``String``: First 32 bytes of the signature
    - ``s`` - ``String``: Next 32 bytes of the signature
    - ``v`` - ``String``: Recovery value + 27


-------
Returns
-------

``String``: The Ethereum address used to sign this data.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.recover({
        messageHash: '0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655',
        v: '0x1c',
        r: '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd',
        s: '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029'
    })
    > "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"

    // hash signature
    web3.eth.accounts.recover('0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a0291c');
    > "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"

    // hash, v, r, s
    web3.eth.accounts.recover('0x1da44b586eb0729ff70a73c326926f6ed5a25f5b056e7f47fbc6e58d86871655', '0x1c', '0xb91467e570a6466aa9e9876cbcd013baba02900b8979d43fe208a4a4f339f5fd', '0x6007e74cd82e037b800186422fc2da167c747ef045e5d18a5f5d4300f8e1a029');
    > "0x2c7536E3605D9C16a7a3D7b1898e529396a65c23"



------------------------------------------------------------------------------


encrypt
=====================

.. code-block:: javascript

    web3.eth.accounts.encrypt(privateKey, password);

Encrypts a private key using web3 keystore standards?

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
    > {"address":"4bf2a80d5c7b337da05b446081f95d0a34f79e7f","Crypto":{"cipher":"aes-128-ctr","ciphertext":"acfe42eed2d102e9bd2383c5c3f9bfdcb346a152dd7b9a3d18bab270f323f683","cipherparams":{"iv":"22cb99fa11a257f3c5b7d19ddb8bb5a4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":261144,"p":1,"r":5,"salt":"81e332698874fc168bfde32f1529648df2fb5d9b2494e7c418ff563f18cbce86"},"mac":"0e82211205dcfb8deaff19e8433f9e966f2d72c488ac54b0b4f6ab1cf594a542"},"id":"e1268f6b-1220-4f7a-a6de-f2ad695831dc","version":3}



------------------------------------------------------------------------------

decrypt
=====================

.. code-block:: javascript

    web3.eth.accounts.decrypt(encryptedPrivateKey, password);

Encrypts a private key using web3 keystore standards?

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

    web3.eth.accounts.decrypt({"address":"4bf2a80d5c7b337da05b446081f95d0a34f79e7f","Crypto":{"cipher":"aes-128-ctr","ciphertext":"acfe42eed2d102e9bd2383c5c3f9bfdcb346a152dd7b9a3d18bab270f323f683","cipherparams":{"iv":"22cb99fa11a257f3c5b7d19ddb8bb5a4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":261144,"p":1,"r":5,"salt":"81e332698874fc168bfde32f1529648df2fb5d9b2494e7c418ff563f18cbce86"},"mac":"0e82211205dcfb8deaff19e8433f9e966f2d72c488ac54b0b4f6ab1cf594a542"},"id":"e1268f6b-1220-4f7a-a6de-f2ad695831dc","version":3}, 'test!$@');
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

1. ``account`` - ``String|Object``: A private key or account object created with :ref:`web3.eth.accounts.new() <accounts-create>`.


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

wallet.encrypt
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.encrypt(privateKey, password);

Encrypts a private key using web3 keystore standards?

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
    > [{"address":"4bf2a80d5c7b337da05b446081f95d0a34f79e7f","Crypto":{"cipher":"aes-128-ctr","ciphertext":"acfe42eed2d102e9bd2383c5c3f9bfdcb346a152dd7b9a3d18bab270f323f683","cipherparams":{"iv":"22cb99fa11a257f3c5b7d19ddb8bb5a4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":261144,"p":1,"r":5,"salt":"81e332698874fc168bfde32f1529648df2fb5d9b2494e7c418ff563f18cbce86"},"mac":"0e82211205dcfb8deaff19e8433f9e966f2d72c488ac54b0b4f6ab1cf594a542"},"id":"e1268f6b-1220-4f7a-a6de-f2ad695831dc","version":3}]



------------------------------------------------------------------------------

wallet.decrypt
=====================

.. code-block:: javascript

    web3.eth.accounts.wallet.decrypt(encryptedPrivateKey, password);

Encrypts a private key using web3 keystore standards?

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

    web3.eth.accounts.decrypt([{"address":"4bf2a80d5c7b337da05b446081f95d0a34f79e7f","Crypto":{"cipher":"aes-128-ctr","ciphertext":"acfe42eed2d102e9bd2383c5c3f9bfdcb346a152dd7b9a3d18bab270f323f683","cipherparams":{"iv":"22cb99fa11a257f3c5b7d19ddb8bb5a4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":261144,"p":1,"r":5,"salt":"81e332698874fc168bfde32f1529648df2fb5d9b2494e7c418ff563f18cbce86"},"mac":"0e82211205dcfb8deaff19e8433f9e966f2d72c488ac54b0b4f6ab1cf594a542"},"id":"e1268f6b-1220-4f7a-a6de-f2ad695831dc","version":3}, {...}], 'test!$@');
    > Wallet {
        0: {...},
        1: {...},
        "0xF0109fC8DF283027b6285cc889F5aA624EaC1F55": {...},
        "0xD0122fC8DF283027b6285cc889F5aA624EaC1d23": {...}
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
    > [{"address":"4bf2a80d5c7b337da05b446081f95d0a34f79e7f","Crypto":{"cipher":"aes-128-ctr","ciphertext":"acfe42eed2d102e9bd2383c5c3f9bfdcb346a152dd7b9a3d18bab270f323f683","cipherparams":{"iv":"22cb99fa11a257f3c5b7d19ddb8bb5a4"},"kdf":"scrypt","kdfparams":{"dklen":32,"n":261144,"p":1,"r":5,"salt":"81e332698874fc168bfde32f1529648df2fb5d9b2494e7c418ff563f18cbce86"},"mac":"0e82211205dcfb8deaff19e8433f9e966f2d72c488ac54b0b4f6ab1cf594a542"},"id":"e1268f6b-1220-4f7a-a6de-f2ad695831dc","version":3}, {...}]



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
