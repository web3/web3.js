.. _eth-ens:

============
web3.eth.ens
============

The ``web3.eth.ens`` functions let you interacting with ENS.

------------------------------------------------------------------------------

registryAddress
=====================

.. code-block:: javascript

    web3.eth.ens.registryAddress;

The ``registryAddress`` property can be used to define a custom registry address when you are connected to an unknown chain.

.. note::
   If no address is defined will it try to detect the registry on the chain you are currently connected with and on the call of ``setProvider`` in the Eth module will it keep the defined address and use it for the ENS module.

-------
Returns
-------

``String`` - The address of the custom registry.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.registryAddress;
    > "0x314159265dD8dbb310642f98f50C066173C1259b"

------------------------------------------------------------------------------

registry
========

.. code-block:: javascript

    web3.eth.ens.registry;

Returns the network specific ENS registry.

-------
Returns
-------

``Registry`` - The current ENS registry.

- ``contract: Contract`` - The ``Registry`` contract with the interface we know from the :ref:`Contract <eth-contract>` object.
- ``owner(name, callback): Promise`` - Deprecated please use ``getOwner``
- ``getOwner(name, callback): Promise``
- ``setOwner(name, address, txConfig, callback): PromiEvent``
- ``resolver(name, callback): Promise`` - Deprecated please use ``getResolver``
- ``getResolver(name, callback): Promise``
- ``setResolver(name, address, txConfig, callback): PromiEvent``
- ``getTTL(name, callback): Promise``
- ``setTTL(name, ttl, txConfig, callback): PromiEvent``
- ``setSubnodeOwner(name, label, address, txConfig, callback): PromiEvent``

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.registry;
    > {
        contract: Contract,
        owner: Function(name, callback), // Deprecated
        getOwner: Function(name, callback),
        setOwner: Function(name, address, txConfig, callback),
        resolver: Function(name, callback) // Deprecated
        getResolver: Function(name, callback)
        setResolver: Function(name, address, txConfig, callback)
        getTTL: Function(name, callback)
        setTTL: Function(name, ttl, txConfig, callback)
        setSubnodeOwner: Function(name, label, address, txConfig, callback)
    }

------------------------------------------------------------------------------

resolver
========

.. code-block:: javascript

    web3.eth.ens.resolver(name [, callback]);

Returns the resolver contract to an Ethereum address.

.. note::
    This method is deprecated please use ``getResolver``

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``Resolver`` - The ENS resolver for this name.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.resolver('ethereum.eth').then(function (contract) {
        console.log(contract);
    });
    > Contract<Resolver>

------------------------------------------------------------------------------

getResolver
===========

.. code-block:: javascript

    web3.eth.ens.getResolver(name [, callback]);

Returns the resolver contract to an Ethereum address.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``Resolver`` - The ENS resolver for this name.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.getResolver('ethereum.eth').then(function (contract) {
        console.log(contract);
    });
    > Contract<Resolver>

------------------------------------------------------------------------------

setResolver
===========

.. code-block:: javascript

    web3.eth.ens.setResolver(name, address [, txConfig ] [, callback]);

Does set the resolver contract address of a name.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``address`` - ``String``: The contract address of the deployed ``Resolver`` contract.
3. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`
4. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``PromiEvent<TransactionReceipt>``

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setResolver('ethereum.eth', '0x...', {...}).then(function (receipt) {
        console.log(receipt);
    });
    > {...}

------------------------------------------------------------------------------

getOwner
========

.. code-block:: javascript

    web3.eth.ens.getOwner(name [, callback]);

Returns the owner of a name.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``String`` - The address of the registrar (EOA or CA).

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.getOwner('ethereum.eth').then(function (owner) {
        console.log(owner);
    });
    > '0x...'


------------------------------------------------------------------------------

setOwner
========

.. code-block:: javascript

    web3.eth.ens.setOwner(name [, txConfig ] [, callback]);

Does set the owner of the given name.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`
3. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``PromiEvent<TransactionReceipt>``

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setOwner('ethereum.eth', {...}).then(function (receipt) {
        console.log(receipt);
    });
    > {...}

------------------------------------------------------------------------------

getTTL
======

.. code-block:: javascript

    web3.eth.ens.getTTL(name [, callback]);

Returns the caching TTL (time-to-live) of a name.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``Promise<Number>``

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.getTTL('ethereum.eth').then(function (ttl) {
        console.log(ttl);
    });
    > 100000

------------------------------------------------------------------------------

setTTL
======

.. code-block:: javascript

    web3.eth.ens.setTTL(name, ttl [, txConfig ] [, callback]);

Does set the caching TTL (time-to-live) of a name.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``ttl`` - ``Number``: The TTL value (uint64)
3. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`
4. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``PromiEvent<TransactionReceipt>``

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setTTL('ethereum.eth', 10000, {...}).then(function (receipt) {
        console.log(receipt);
    });
    > {...}

------------------------------------------------------------------------------

setSubnodeOwner
===============

.. code-block:: javascript

    web3.eth.ens.setSubnodeOwner(name, label, address [, txConfig ] [, callback]);

Does set the caching TTL (time-to-live) of a name.

----------
Parameters
----------

1. ``name`` - ``String``: The ENS name.
2. ``label`` - ``String``: The name of the sub-domain
3. ``address`` - ``String``: The registrar of this sub-domain
4. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`
5. ``callback`` - ``Function``: (optional) Optional callback

-------
Returns
-------

``PromiEvent<TransactionReceipt>``

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setSubnodeOwner('ethereum.eth', 'web3', '0x...', {...}).then(function (receipt) {
        console.log(receipt); // successfully web3.ethereum.eth registered
    });
    > {...}

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

    web3.eth.ens.getAddress('ethereum.eth').then(function (address) {
        console.log(address);
    })
    > 0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359

------------------------------------------------------------------------------

setAddress
=====================

.. code-block:: javascript

    web3.eth.ens.setAddress(ENSName, address [, txConfig ] [, callback]);

Sets the address of an ENS name in his resolver.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``address`` - ``String``: The address to set.
3. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`

Emits an ``AddrChanged`` event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setAddress(
        'ethereum.eth',
        '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    ).then(function (result) {
             console.log(result.events);
    });
    > AddrChanged(...)

    // Or using the event emitter

    web3.eth.ens.setAddress(
        'ethereum.eth',
        '0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    )
    .on('transactionHash', function(hash){
        ...
    })
    .on('confirmation', function(confirmationNumber, receipt){
        ...
    })
    .on('receipt', function(receipt){
        ...
    })
    .on('error', console.error);

    // Or listen to the AddrChanged event on the resolver

    web3.eth.ens.resolver('ethereum.eth').then(function (resolver) {
        resolver.events.AddrChanged({fromBlock: 0}, function(error, event) {
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', console.error);
    });


For further information on the handling of contract events please see :ref:`here <contract-events>`.

------------------------------------------------------------------------------

getPubkey
=====================

.. code-block:: javascript

    web3.eth.ens.getPubkey(ENSName);

Returns the X and Y coordinates of the curve point for the public key.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.

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

    web3.eth.ens.setPubkey(ENSName, x, y [, txConfig ] [, callback]);

Sets the SECP256k1 public key associated with an ENS node

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``x`` - ``String``: The X coordinate of the public key.
3. ``y`` - ``String``: The Y coordinate of the public key.
4. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`

Emits an ``PubkeyChanged`` event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setPubkey(
        'ethereum.eth',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    ).then(function (result) {
        console.log(result.events);
    });
    > PubkeyChanged(...)

    // Or using the event emitter

    web3.eth.ens.setPubkey(
        'ethereum.eth',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    )
    .on('transactionHash', function(hash){
        ...
    })
    .on('confirmation', function(confirmationNumber, receipt){
        ...
    })
    .on('receipt', function(receipt){
        ...
    })
    .on('error', console.error);

    // Or listen to the PubkeyChanged event on the resolver

    web3.eth.ens.resolver('ethereum.eth').then(function (resolver) {
        resolver.events.PubkeyChanged({fromBlock: 0}, function(error, event) {
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', console.error);
    });


For further information on the handling of contract events please see :ref:`here <contract-events>`.

------------------------------------------------------------------------------

getContent
=====================

.. code-block:: javascript

    web3.eth.ens.getContent(ENSName);

Returns the content hash associated with an ENS node.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.

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

    web3.eth.ens.setContent(ENSName, hash [, txConfig ] [, callback]);

Sets the content hash associated with an ENS node.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``hash`` - ``String``: The content hash to set.
3. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`

Emits an ``ContentChanged`` event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setContent(
        'ethereum.eth',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    ).then(function (result) {
             console.log(result.events);
     });
    > ContentChanged(...)

    // Or using the event emitter

    web3.eth.ens.setContent(
        'ethereum.eth',
        '0x0000000000000000000000000000000000000000000000000000000000000000',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    )
    .on('transactionHash', function(hash){
        ...
    })
    .on('confirmation', function(confirmationNumber, receipt){
        ...
    })
    .on('receipt', function(receipt){
        ...
    })
    .on('error', console.error);

    // Or listen to the ContentChanged event on the resolver

    web3.eth.ens.resolver('ethereum.eth').then(function (resolver) {
        resolver.events.ContentChanged({fromBlock: 0}, function(error, event) {
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', console.error);
    });


For further information on the handling of contract events please see :ref:`here <contract-events>`.

------------------------------------------------------------------------------

getMultihash
=====================

.. code-block:: javascript

    web3.eth.ens.getMultihash(ENSName);

Returns the multihash associated with an ENS node.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.

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

    web3.eth.ens.setMultihash(ENSName, hash [, txConfig ] [, callback]);

Sets the multihash associated with an ENS node.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``hash`` - ``String``: The multihash to set.
3. ``txConfig`` - ``Object``: (optional) The transaction options as described ::ref::`here <eth-sendtransaction>`

Emits an ``MultihashChanged``event.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.setMultihash(
        'ethereum.eth',
        'QmXpSwxdmgWaYrgMUzuDWCnjsZo5RxphE3oW7VhTMSCoKK',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    ).then(function (result) {
        console.log(result.events);
    });
    > MultihashChanged(...)

    // Or using the event emitter

    web3.eth.ens.setMultihash(
        'ethereum.eth',
        'QmXpSwxdmgWaYrgMUzuDWCnjsZo5RxphE3oW7VhTMSCoKK',
        {
            from: '0x9CC9a2c777605Af16872E0997b3Aeb91d96D5D8c'
        }
    )
    .on('transactionHash', function(hash){
        ...
    })
    .on('confirmation', function(confirmationNumber, receipt){
        ...
    })
    .on('receipt', function(receipt){
        ...
    })
    .on('error', console.error);


For further information on the handling of contract events please see :ref:`here <contract-events>`.

------------------------------------------------------------------------------

ENS events
=====================

The ENS API provides the possibility for listening to all ENS related events.

------------
Known resolver events
------------

1. AddrChanged(node bytes32, a address)
2. ContentChanged(node bytes32, hash bytes32)
4. NameChanged(node bytes32, name string)
5. ABIChanged(node bytes32, contentType uint256)
6. PubkeyChanged(node bytes32, x bytes32, y bytes32)

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.resolver('ethereum.eth').then(function (resolver) {
        resolver.events.AddrChanged({fromBlock: 0}, function(error, event) {
            console.log(event);
        })
        .on('data', function(event){
            console.log(event);
        })
        .on('changed', function(event){
            // remove event from local database
        })
        .on('error', console.error);
    });
    > {
        returnValues: {
            node: '0x123456789...',
            a: '0x123456789...',
        },
        raw: {
            data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
            topics: [
                '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
                '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
            ]
        },
        event: 'AddrChanged',
        signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
        logIndex: 0,
        transactionIndex: 0,
        transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
        blockNumber: 1234,
        address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
    }

------------
Known registry events
------------

1. Transfer(node bytes32, owner address)
2. NewOwner(node bytes32, label bytes32, owner address)
4. NewResolver(node bytes32, resolver address)
5. NewTTL(node bytes32, ttl uint64)

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.resistry.then(function (registry) {
        registry.events.Transfer({fromBlock: 0}, , function(error, event) {
              console.log(event);
          })
          .on('data', function(event){
              console.log(event);
          })
          .on('changed', function(event){
              // remove event from local database
          })
          .on('error', console.error);
    });
    > {
        returnValues: {
            node: '0x123456789...',
            owner: '0x123456789...',
        },
        raw: {
            data: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
            topics: [
                '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
                '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385'
            ]
        },
        event: 'Transfer',
        signature: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
        logIndex: 0,
        transactionIndex: 0,
        transactionHash: '0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385',
        blockHash: '0xfd43ade1c09fade1c0d57a7af66ab4ead7c2c2eb7b11a91ffdd57a7af66ab4ead7',
        blockNumber: 1234,
        address: '0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe'
    }


For further information on the handling of contract events please see :ref:`here <contract-events>`.

------------------------------------------------------------------------------
