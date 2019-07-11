.. _eth-ens:

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

    web3.eth.ens.registry;
    > {
        ens: ENS,
        contract: Contract,
        owner: Function(name),
        resolve: Function(name)
    }

------------------------------------------------------------------------------

resolver
=====================

.. code-block:: javascript

    web3.eth.ens.resolver(name);

Returns the resolver contract to an Ethereum address.

-------
Returns
-------

``Reslver`` - The ENS resolver for this name.

-------
Example
-------

.. code-block:: javascript

    web3.eth.ens.resolver('ethereum.eth').then(function (contract) {
        console.log(contract);
    });
    > Contract<Resolver>

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

    web3.eth.ens.setAddress(ENSName, address, options);

Sets the address of an ENS name in his resolver.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``address`` - ``String``: The address to set.
3. ``options`` - ``Object``: The options used for sending.
    * ``from`` - ``String``: The address the transaction should be sent from.
    * ``gasPrice`` - ``String`` (optional): The gas price in wei to use for this transaction.
    * ``gas`` - ``Number`` (optional): The maximum gas provided for this transaction (gas limit).

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


    For further information on the handling of contract events please see here contract-events_.

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

    web3.eth.ens.setPubkey(ENSName, x, y, options);

Sets the SECP256k1 public key associated with an ENS node

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``x`` - ``String``: The X coordinate of the public key.
3. ``y`` - ``String``: The Y coordinate of the public key.
4. ``options`` - ``Object``: The options used for sending.
    * ``from`` - ``String``: The address the transaction should be sent from.
    * ``gasPrice`` - ``String`` (optional): The gas price in wei to use for this transaction.
    * ``gas`` - ``Number`` (optional): The maximum gas provided for this transaction (gas limit).


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


    For further information on the handling of contract events please see here contract-events_.

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

    web3.eth.ens.setContent(ENSName, hash, options);

Sets the content hash associated with an ENS node.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``hash`` - ``String``: The content hash to set.
3. ``options`` - ``Object``: The options used for sending.
    * ``from`` - ``String``: The address the transaction should be sent from.
    * ``gasPrice`` - ``String`` (optional): The gas price in wei to use for this transaction.
    * ``gas`` - ``Number`` (optional): The maximum gas provided for this transaction (gas limit).


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


    For further information on the handling of contract events please see here contract-events_.

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

    web3.eth.ens.setMultihash(ENSName, hash, options);

Sets the multihash associated with an ENS node.

----------
Parameters
----------

1. ``ENSName`` - ``String``: The ENS name.
2. ``hash`` - ``String``: The multihash to set.
3. ``options`` - ``Object``: The options used for sending.
    * ``from`` - ``String``: The address the transaction should be sent from.
    * ``gasPrice`` - ``String`` (optional): The gas price in wei to use for this transaction.
    * ``gas`` - ``Number`` (optional): The maximum gas provided for this transaction (gas limit).


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


    For further information on the handling of contract events please see here contract-events_.

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

For further information on the handling of contract events please see here contract-events_.

------------------------------------------------------------------------------

