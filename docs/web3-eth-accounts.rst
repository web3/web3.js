.. _eth-accounts:


=========
web3.eth.accounts
=========

The ``web3.eth.accounts`` contains functions to generate Ethereum accounts and sign transactions.


------------------------------------------------------------------------------


new
=====================

.. code-block:: javascript

    web3.eth.accounts.new([entropy]);

Generates an account object with private key and public key.

----------
Parameters
----------

1. ``entropy`` - ``String`` (optional): A random strong to increase entropy. If igven it should be at least 32 characters. If none is given a random string will be generated using :ref:`randomhex <randomhex>`.

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

privateToPublic
=====================

.. code-block:: javascript

    web3.eth.accounts.privateToPublic(privateKey);

Gets the public key from a private key.

----------
Parameters
----------

1. ``privateKey`` - ``String``: The private key to convert.

-------
Returns
-------

``String`` - The accounts public key.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.privateToPublic('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > "0xbb1846722a4c27e71196e1a44611ee7174276a6c51c4830fb810cac64b0725f217cb8783625a809d1303adeeec2cf036ab74098a77a6b7f1003486e173b29aa7"

    web3.eth.accounts.privateToPublic('348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > "0xbb1846722a4c27e71196e1a44611ee7174276a6c51c4830fb810cac64b0725f217cb8783625a809d1303adeeec2cf036ab74098a77a6b7f1003486e173b29aa7"


------------------------------------------------------------------------------

privateToAddress
=====================

.. code-block:: javascript

    web3.eth.accounts.privateToAddress(privateKey);

Gets the Ethereum address from a private key.

----------
Parameters
----------

1. ``privateKey`` - ``String``: The private key to convert.

-------
Returns
-------

``String`` - The accounts address.

-------
Example
-------

.. code-block:: javascript

    web3.eth.accounts.privateToAddress('0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01"

    web3.eth.accounts.privateToAddress('348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709');
    > "0xb8CE9ab6943e0eCED004cDe8e3bBed6568B2Fa01"


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
