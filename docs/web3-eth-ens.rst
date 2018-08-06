.. _eth-ens:

.. include:: include_announcement.rst

=========
web3.eth.ens
=========

The ``web3.eth.ens`` functions let you interacting with ENS.

------------------------------------------------------------------------------
registry
=====================

.. code-block:: javascript

    web3.eth.ens.registry;

Returns the network specific ENS registry.

-------
Returns
-------

``Registry`` - The current ENS registry.

-------
Example
-------

.. code-block:: javascript

    // From a JSON interface object
    web3.eth.ens.registry;
    > {
        ens: ENS,
        contract: Contract,
        owner: Function(name),
        resolve: Function(name)
    }

------------------------------------------------------------------------------

getAddress
=====================

.. code-block:: javascript

    web3.eth.ens.getAddress(ENSName);

Resolves an ENS name to an Ethereum address.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name to resolve.

-------
Returns
-------

``String`` - The Ethereum address of the given name.

-------
Example
-------

.. code-block:: javascript

    // From a JSON interface object
    web3.eth.ens.getAddress('ethereum.eth').then(function (address) {
        console.log(address);
    });
    > 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359

------------------------------------------------------------------------------

setAddress
=====================

.. code-block:: javascript

    web3.eth.ens.setAddress(name, address, from);

Sets the address of an ENS name in his resolver.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``address`` - ``String``: The address to set.
3. ``from`` - ``String``: Current account address.

Emits an ``AddrChanged`` event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setAddress(
        'ethereum.eth',
        '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
        '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
    ).then(function (result) {
             console.log(result.events);
    });
    > AddrChanged(...)

------------------------------------------------------------------------------

getPubkey
=====================

.. code-block:: javascript

    web3.eth.ens.getPubkey(name);

Returns the X and Y coordinates of the curve point for the public key.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.

-------
Returns
-------

``Object<String, String>`` - The X and Y coordinates.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.getPubkey('ethereum.eth').then(function (result) {
        console.log(result)
    });
    > {
        "0": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "1": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "x": "0x0000000000000000000000000000000000000000000000000000000000000000",
        "y": "0x0000000000000000000000000000000000000000000000000000000000000000"
    }

------------------------------------------------------------------------------

setPubkey
=====================

.. code-block:: javascript

    web3.eth.ens.setPubkey(name, x, y, from);

Sets the SECP256k1 public key associated with an ENS node

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``x`` - ``String``: The X coordinate of the public key.
3. ``y`` - ``String``: The Y coordinate of the public key.
4. ``from`` - ``String``: The current address.

Emits an ``PubkeyChanged`` event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setPubkey(
        'ethereum.eth',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
    ).then(function (result) {
        console.log(result.events);
    });
    > PubkeyChanged(...)

------------------------------------------------------------------------------

getContent
=====================

.. code-block:: javascript

    web3.eth.ens.getContent(name);

Returns the content hash associated with an ENS node.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.

-------
Returns
-------

``String`` - The content hash associated with an ENS node.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.getContent('ethereum.eth').then(function (result) {
        console.log(result);
    });
    > "0x0000000000000000000000000000000000000000000000000000000000000000"

------------------------------------------------------------------------------

setContent
=====================

.. code-block:: javascript

    web3.eth.ens.setContent(name, hash, from);

Sets the content hash associated with an ENS node.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``hash`` - ``String``: The content hash to set.
2. ``from`` - ``String``: The current address.

Emits an ``ContentChanged`` event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setContent(
        'ethereum.eth',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
    ).then(function (result) {
             console.log(result.events);
     });
    > ContentChanged(...)

------------------------------------------------------------------------------

getMultihash
=====================

.. code-block:: javascript

    web3.eth.ens.getMultihash(name);

Returns the multihash associated with an ENS node.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.

-------
Returns
-------

``String`` - The associated multihash.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.getMultihash('ethereum.eth').then(function (result) {
        console.log(result);
    });
    > 'QmXpSwxdmgWaYrgMUzuDWCnjsZo5RxphE3oW7VhTMSCoKK'

------------------------------------------------------------------------------

setMultihash
=====================

.. code-block:: javascript

    web3.eth.ens.setMultihash(name, hash, from);

Sets the multihash associated with an ENS node.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``hash`` - ``String``: The multihash to set.
2. ``from`` - ``String``: The current account.

Emits an ``MultihashChanged``event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setMultihash(
        'ethereum.eth',
        'QmXpSwxdmgWaYrgMUzuDWCnjsZo5RxphE3oW7VhTMSCoKK',
        '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
    ).then(function (result) {
        console.log(result.events);
    });
    > MultihashChanged(...)
