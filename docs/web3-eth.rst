========
web3.eth
========


TODO: add instantiation code with web3 and Eth package

TODO: add note about checksum addresses



------------------------------------------------------------------------------

setProvider
=====================

.. code-block:: javascript

    web3.eth.setProvider(myProvider)

When called changes the current provider for all modules.

----------
Parameters
----------

1. ``Object`` - **myProvider**: :ref:`a valid provider <web3-providers>`.

-------
Returns
-------

``Boolean``

-------
Example
-------

.. code-block:: javascript

    eth.setProvider(new eth.providers.HttpProvider('http://localhost:8545'));


------------------------------------------------------------------------------


web3.eth.defaultAccount
=====================

.. code-block:: javascript

    web3.eth.defaultAccount

This default address is used as the default ``"from"`` property, if no ``"from"`` property is specified in for the following methods:

- :ref:`web3.eth.sendTransaction() <eth-sendtransaction>`
- :ref:`web3.eth.call() <eth-call>`
- :ref:`new web3.eth.contract() -> myContract.methods.myMethod().call() <eth-contract-call>`
- :ref:`new web3.eth.contract() -> myContract.methods.myMethod().send() <eth-contract-send>`

--------
Property
--------


``String`` - 20 Bytes: Any ethereum address. You should have the private key for that address in your node or keystore. (Default is ``undefined``)


-------
Example
-------


.. code-block:: javascript

    web3.eth.defaultAccount;
    > undefined

    // set the default account
    web3.eth.defaultAccount = '0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe';


------------------------------------------------------------------------------

.. _eth-defaultblock:

web3.eth.defaultBlock
=====================

.. code-block:: javascript

    web3.eth.defaultBlock

The default block is used for certain methods. You can override it by passing in the defaultBlock as last parameter.
The default value is "latest".

- :ref:`web3.eth.getBalance() <eth-getbalance>`
- :ref:`web3.eth.getCode() <eth-getcode>`
- :ref:`web3.eth.getTransactionCount() <eth-gettransactioncount>`
- :ref:`web3.eth.getStorageAt() <eth-getstorageat>`
- :ref:`web3.eth.call() <eth-call>`
- :ref:`new web3.eth.contract() -> myContract.methods.myMethod().call() <eth-contract-call>`

----------
Property
----------


Default block parameters can be one of the following:

- ``Number``: A block number
- ``String`` - ``"genesis"``: The genesis block
- ``String`` - ``"latest"``: The latest block (current head of the blockchain)
- ``String`` - ``"pending"``: The currently mined block (including pending transactions)

Default is ``latest``


-------
Example
-------

.. code-block:: javascript

    web3.eth.defaultBlock;
    > "latest"

    // set the default block
    web3.eth.defaultBlock = 231;


------------------------------------------------------------------------------


web3.eth.isSyncing
=====================

.. code-block:: javascript

    web3.eth.isSyncing([callback])

Checks if the node is currently syncing and returns either a syncing object, or ``false``.

-------
Returns
-------

``Promise`` returns ``Object|Boolean`` - A sync object when the node is currently syncing or ``false``:
    - ``startingBlock``: ``Number`` - The block number where the sync started.
    - ``currentBlock``: ``Number`` - The block number where at which block the node currently synced to already.
    - ``highestBlock``: ``Number`` - The estimated block number to sync to.
    - ``knownStates``: ``Number`` - The estimated states to download
    - ``pulledStates``: ``Number`` - The already downloaded states


-------
Example
-------

.. code-block:: javascript

    web3.eth.isSyncing().
    .then(console.log);

    > {
        startingBlock: 100,
        currentBlock: 312,
        highestBlock: 512,
        knownStates: 234566,
        pulledStates: 123455
    }


------------------------------------------------------------------------------


web3.eth.getCoinbase
=====================

.. code-block:: javascript

    web3.eth.getCoinbase([callback])

Returns the coinbase address were the mining rewards currently go to.

-------
Returns
-------

``Promise`` returns ``String`` - bytes 20: The coinbase address set in the node for mining rewards.


-------
Example
-------

.. code-block:: javascript

    web3.eth.getCoinbase()
    .then(console.log);
    > "0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe"


------------------------------------------------------------------------------

web3.eth.isMining
=====================

.. code-block:: javascript

    web3.eth.isMining([callback])


Checks whether the node is mining or not.

-------
Returns
-------

``Promise`` returns ``Boolean``: ``true`` if the node is mining, otherwise ``false``.


-------
Example
-------

.. code-block:: javascript

    web3.eth.isMining()
    .then(console.log);
    > true


------------------------------------------------------------------------------

web3.eth.getHashrate
=====================

.. code-block:: javascript

    web3.eth.getHashrate([callback])

Returns the number of hashes per second that the node is mining with.

-------
Returns
-------

``Promise`` returns ``Number``: Number of hashes per second.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getHashrate()
    .then(console.log);
    > 493736


------------------------------------------------------------------------------

web3.eth.getGasPrice
=====================

.. code-block:: javascript

    web3.eth.getGasPrice([callback])


Returns the current gas price oracle.
The gas price is determined by the last few blocks median gas price.

-------
Returns
-------

``Promise`` returns ``String`` - Number string of the current gas price in :ref:`wei <what-is-wei>`.

See the :ref:`A note on dealing with big numbers in JavaScript <big-numbers-in-javascript>`.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getGasPrice()
    .then(console.log);
    > "20000000000"


------------------------------------------------------------------------------


web3.eth.getAccounts
=====================

.. code-block:: javascript

    web3.eth.getAccounts([callback])

Returns a list of accounts the node controls.

-------
Returns
-------


``Promise`` returns ``Array`` - An array of addresses controlled by node.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getAccounts()
    .then(console.log);
    > ["0x11f4d0A3c12e86B4b5F39B213F7E19D048276DAe", "0xDCc6960376d6C6dEa93647383FfB245CfCed97Cf"]


------------------------------------------------------------------------------


web3.eth.getBlockNumber
=====================

.. code-block:: javascript

    web3.eth.getBlockNumber([callback])

Returns the current block number.

-------
Returns
-------

``Promise`` returns ``Number`` - The number of the most recent block.

-------
Example
-------


.. code-block:: javascript

    web3.eth.blockNumber()
    .then(console.log);
    > 2744


------------------------------------------------------------------------------



web3.eth.getBalance
=====================

.. code-block:: javascript

    web3.eth.getBalance(address [, defaultBlock] [, callback])

Get the balance of an address at a given block.

----------
Parameters
----------

1. ``String`` - The address to get the balance of.
2. ``Number|String`` - (optional) If you pass this parameter it will not use the default block set with :ref:`web3.eth.defaultBlock <eth-defaultblock>`.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise`` returns ``String`` - The current balance for the given address in :ref:`wei <what-is-wei>`.

See the :ref:`A note on dealing with big numbers in JavaScript <big-numbers-in-javascript>`.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
    .then(console.log);
    > "1000000000000"


------------------------------------------------------------------------------

web3.eth.getStorageAt
=====================

.. code-block:: javascript

    web3.eth.getStorageAt(address, position [, defaultBlock] [, callback])

Get the storage at a specific position of an address.

----------
Parameters
----------

1. ``String`` - The address to get the storage from.
2. ``Number`` - The index position of the storage.
3. ``Number|String`` - (optional) If you pass this parameter it will not use the default block set with :ref:`web3.eth.defaultBlock <eth-defaultblock>`.
4. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------

``Promise`` returns ``String`` - The value in storage at the given position.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0)
    .then(console.log);
    > "0x033456732123ffff2342342dd12342434324234234fd234fd23fd4f23d4234"


------------------------------------------------------------------------------

web3.eth.getCode
=====================

.. code-block:: javascript

    web3.eth.getCode(address [, defaultBlock] [, callback])

Get the code at a specific address.

----------
Parameters
----------

1. ``String`` - The address to get the code from.
2. ``Number|String`` - (optional) If you pass this parameter it will not use the default block set with :ref:`web3.eth.defaultBlock <eth-defaultblock>`.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise`` returns ``String`` - The data at given address ``address``.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8")
    .then(console.log);
    > "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"


------------------------------------------------------------------------------

.. _eth-getblock:

web3.eth.getBlock
=====================

.. code-block:: javascript

     web3.eth.getBlock(blockHashOrBlockNumber [, returnTransactionObjects] [, callback])

Returns a block matching the block number or block hash.

----------
Parameters
----------

1. ``String|Number`` - The block number or block hash. Or the string ``"genesis"``, ``"latest"`` or ``"pending"`` as in the :ref:`default block parameter <eth-defaultblock>`.
2. ``Boolean`` - (optional, default ``false``) If ``true``, the returned block will contain all transactions as objects, if ``false`` it will only contains the transaction hashes.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise`` returns ``Object`` - The block object:

  - ``number``: ``Number`` - the block number. ``null`` when its pending block.
  - ``hash``: ``String``, 32 Bytes - hash of the block. ``null`` when its pending block.
  - ``parentHash``: ``String``, 32 Bytes - hash of the parent block.
  - ``nonce``: ``String``, 8 Bytes - hash of the generated proof-of-work. ``null`` when its pending block.
  - ``sha3Uncles``: ``String``, 32 Bytes - SHA3 of the uncles data in the block.
  - ``logsBloom``: ``String``, 256 Bytes - the bloom filter for the logs of the block. ``null`` when its pending block.
  - ``transactionsRoot``: ``String``, 32 Bytes - the root of the transaction trie of the block
  - ``stateRoot``: ``String``, 32 Bytes - the root of the final state trie of the block.
  - ``miner``: ``String``, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  - ``difficulty``: ``String`` - integer of the difficulty for this block.
  - ``totalDifficulty``: ``String`` - integer of the total difficulty of the chain until this block.
  - ``extraData``: ``String`` - the "extra data" field of this block.
  - ``size``: ``Number`` - integer the size of this block in bytes.
  - ``gasLimit``: ``Number`` - the maximum gas allowed in this block.
  - ``gasUsed``: ``Number`` - the total used gas by all transactions in this block.
  - ``timestamp``: ``Number`` - the unix timestamp for when the block was collated.
  - ``transactions``: ``Array`` - Array of transaction objects, or 32 Bytes transaction hashes depending on the ``returnTransactionObjects`` parameter.
  - ``uncles``: ``Array`` - Array of uncle hashes.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getBlock(3150);
    .then(console.log);

    > {
      "number": 3,
      "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
      "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
      "nonce": "0xfb6e1a62d119228b",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
      "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
      "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
      "difficulty": '21345678965432',
      "totalDifficulty": '324567845321',
      "size": 616,
      "extraData": "0x",
      "gasLimit": 3141592,
      "gasUsed": 21662,
      "timestamp": 1429287689,
      "transactions": [
        "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b"
      ],
      "uncles": []
    }


------------------------------------------------------------------------------


web3.eth.getBlockTransactionCount
=====================

.. code-block:: javascript

    web3.eth.getBlockTransactionCount(blockHashOrBlockNumber [, callback])

Returns the number of transaction in a given block.

----------
Parameters
----------


1. ``String|Number`` - The block number or hash. Or the string ``"genesis"``, ``"latest"`` or ``"pending"`` as in the :ref:`default block parameter <eth-defaultblock>`.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Promise`` returns ``Number`` - The number of transactions in the given block.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1")
    .then(console.log);
    > 1


------------------------------------------------------------------------------

web3.eth.getUncle
=====================

.. code-block:: javascript

    web3.eth.getUncle(blockHashOrBlockNumber, uncleIndex [, returnTransactionObjects] [, callback])

Returns a blocks uncle by a given uncle index position.

----------
Parameters
----------

1. ``String|Number`` - The block number or hash. Or the string ``"genesis"``, ``"latest"`` or ``"pending"`` as in the :ref:`default block parameter <eth-defaultblock>`.
2. ``Number`` - The index position of the uncle.
3. ``Boolean`` - (optional, default ``false``) If ``true``, the returned block will contain all transactions as objects, if ``false`` it will only contains the transaction hashes.
4. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise`` returns ``Object`` - the returned uncle. For a return value see :ref:`web3.eth.getBlock() <eth-getblock>`.

**Note**: An uncle doesn't contain individual transactions.

-------
Example
-------


.. code-block:: javascript

    web3.eth.getUncle(500, 0)
    .then(console.log);
    > // see web3.eth.getBlock



------------------------------------------------------------------------------


web3.eth.getTransaction
=====================

.. code-block:: javascript

    web3.eth.getTransaction(transactionHash [, callback])

Returns a transaction matching the given transaction hash.

----------
Parameters
----------

1. ``String`` - The transaction hash.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.


-------
Returns
-------


``Promise`` returns ``Object`` - A transaction object its hash ``transactionHash``:

  - ``hash``: ``String``, 32 Bytes - hash of the transaction.
  - ``nonce``: ``Number`` - the number of transactions made by the sender prior to this one.
  - ``blockHash``: ``String``, 32 Bytes - hash of the block where this transaction was in. ``null`` when its pending.
  - ``blockNumber``: ``Number`` - block number where this transaction was in. ``null`` when its pending.
  - ``transactionIndex``: ``Number`` - integer of the transactions index position in the block. ``null`` when its pending.
  - ``from``: ``String``, 20 Bytes - address of the sender.
  - ``to``: ``String``, 20 Bytes - address of the receiver. ``null`` when its a contract creation transaction.
  - ``value``: ``BigNumber`` - value transferred in :ref:`wei <what-is-wei>`.
  - ``gasPrice``: ``BigNumber`` - gas price provided by the sender in :ref:`wei <what-is-wei>`.
  - ``gas``: ``Number`` - gas provided by the sender.
  - ``input``: ``String`` - the data sent along with the transaction.


-------
Example
-------


.. code-block:: javascript

var blockNumber = 668;
var indexOfTransaction = 0

var transaction = web3.eth.getTransaction(blockNumber, indexOfTransaction);
console.log(transaction);
/*
{
  "hash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "nonce": 2,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "transactionIndex": 0,
  "from": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "to": "0x6295ee1b4f6dd65047762f924ecd367c17eabf8f",
  "value": BigNumber,
  "gas": 314159,
  "gasPrice": BigNumber,
  "input": "0x57cb2fc4"
}
*/



------------------------------------------------------------------------------

web3.eth.getTransactionFromBlock
=====================

.. code-block:: javascript

    getTransactionFromBlock(hashStringOrNumber, indexNumber [, callback])

Returns a transaction based on a block hash or number and the transactions index position.

----------
Parameters
----------


1. ``String`` - A block number or hash. Or the string ``"genesis"``, ``"latest"`` or ``"pending"`` as in the :ref:`default block parameter <eth-defaultblock>`.
2. ``Number`` - The transactions index position.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Object`` - A transaction object, see :ref:`web3.eth.getTransaction <eth-gettransaction>`:


-------
Example
-------


.. code-block:: javascript

var transaction = web3.eth.getTransactionFromBlock('0x4534534534', 2);
console.log(transaction); // see web3.eth.getTransaction



------------------------------------------------------------------------------

web3.eth.getTransactionReceipt
=====================

.. code-block:: javascript

    web3.eth.getTransactionReceipt(hashString [, callback])

Returns the receipt of a transaction by transaction hash.

**Note** That the receipt is not available for pending transactions.


----------
Parameters
----------

1. ``String`` - The transaction hash.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Object`` - A transaction receipt object, or ``null`` when no receipt was found:

  - ``blockHash``: ``String``, 32 Bytes - hash of the block where this transaction was in.
  - ``blockNumber``: ``Number`` - block number where this transaction was in.
  - ``transactionHash``: ``String``, 32 Bytes - hash of the transaction.
  - ``transactionIndex``: ``Number`` - integer of the transactions index position in the block.
  - ``from``: ``String``, 20 Bytes - address of the sender.
  - ``to``: ``String``, 20 Bytes - address of the receiver. ``null`` when its a contract creation transaction.
  - `cumulativeGasUsed `: `Number ` - The total amount of gas used when this transaction was executed in the block.
  - `gasUsed `: `Number ` -  The amount of gas used by this specific transaction alone.
  - `contractAddress `: ``String`` - 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise ``null``.
  - `logs `:  ``Array`` - Array of log objects, which this transaction generated.

-------
Example
-------

.. code-block:: javascript

var receipt = web3.eth.getTransactionReceipt('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
console.log(receipt);
{
  "transactionHash": "0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b",
  "transactionIndex": 0,
  "blockHash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "blockNumber": 3,
  "contractAddress": "0xa94f5374fce5edbc8e2a8697c15331677e6ebf0b",
  "cumulativeGasUsed": 314159,
  "gasUsed": 30234,
  "logs": [{
         // logs as returned by getFilterLogs, etc.
     }, ...]
}


------------------------------------------------------------------------------

web3.eth.getTransactionCount
=====================

.. code-block:: javascript

    web3.eth.getTransactionCount(address [, defaultBlock] [, callback])

Get the numbers of transactions sent from this address.

----------
Parameters
----------

1. ``String`` - The address to get the numbers of transactions from.
2. ``"Number|String"`` - (optional) If you pass this parameter it will not use the default block set with :ref:`web3.eth.defaultBlock <eth-defaultblock>`.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Number`` - The number of transactions sent from the given address.

-------
Example
-------


.. code-block:: javascript

var number = web3.eth.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1


------------------------------------------------------------------------------

web3.eth.sendTransaction
=====================

.. code-block:: javascript

    web3.eth.sendTransaction(transactionObject [, callback])

Sends a transaction to the network.

----------
Parameters
----------


1. ``Object`` - The transaction object to send:
  - ``from``: ``String`` - The address for the sending account. Uses the :ref:`web3.eth.defaultAccount <eth-defaultaccount>` property, if not specified.
  - ``to``: ``String`` - (optional) The destination address of the message, left undefined for a contract-creation transaction.
  - ``value``: ``"Number|String|BigNumber"`` - (optional) The value transferred for the transaction in :ref:`wei <what-is-wei>`, also the endowment if it's a contract-creation transaction.
  - ``gas``: ``"Number|String|BigNumber"`` - (optional, default: To-Be-Determined) The amount of gas to use for the transaction (unused gas is refunded).
  - ``gasPrice``: ``"Number|String|BigNumber"`` - (optional, default: To-Be-Determined) The price of gas for this transaction in :ref:`wei <what-is-wei>`, defaults to the mean network gas price.
  - ``data``: ``String`` - (optional) Either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
  - ``nonce``: ``Number``  - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``String`` - The 32 Bytes transaction hash as HEX string.

If the transaction was a contract creation use :ref:`web3.eth.getTransactionReceipt() <web3gettransactionreceipt>` to get the contract address, after the transaction was mined.

-------
Example
-------


.. code-block:: javascript


// compiled solidity source code using https://chriseth.github.io/cpp-ethereum/
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";

web3.eth.sendTransaction({data: code}, function(err, address) {
  if (!err)
    console.log(address); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
});


------------------------------------------------------------------------------

web3.eth.sendSignedTransaction
=====================

.. code-block:: javascript

    web3.eth.sendSignedTransaction(signedTransactionData [, callback])

Sends an already signed transaction. For example can be signed using: https://github.com/SilentCicero/ethereumjs-accounts

----------
Parameters
----------

1. ``String`` - Signed transaction data in HEX format
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``String`` - The 32 Bytes transaction hash as HEX string.

If the transaction was a contract creation use :ref:`web3.eth.getTransactionReceipt() <web3gettransactionreceipt>` to get the contract address, after the transaction was mined.

-------
Example
-------


.. code-block:: javascript

var Tx = require('ethereumjs-tx');
var privateKey = new Buffer('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

var rawTx = {
  nonce: '0x00',
  gasPrice: '0x09184e72a000',
  gasLimit: '0x2710',
  to: '0x0000000000000000000000000000000000000000',
  value: '0x00',
  data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057'
}

var tx = new Tx(rawTx);
tx.sign(privateKey);

var serializedTx = tx.serialize();

//console.log(serializedTx.toString('hex'));
//0xf889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f

web3.eth.sendSignedTransaction(serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});


------------------------------------------------------------------------------


web3.eth.sign
=====================

.. code-block:: javascript

    web3.eth.sign(address, dataToSign, [, callback])

Signs data from a specific account. This account needs to be unlocked.

----------
Parameters
----------


1. ``String`` - Address to sign with.
2. ``String`` - Data to sign.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``String`` - The signed data.

After the hex prefix, characters correspond to ECDSA values like this:
```
r = signature[0:64]
s = signature[64:128]
v = signature[128:130]
```

Note that if you are using ``ecrecover``, ``v`` will be either `"00"` or `"01"`. As a result, in order to use this value, you will have to parse it to an integer and then add `27`. This will result in either a `27` or a `28`.

-------
Example
-------


.. code-block:: javascript

var result = web3.eth.sign("0x135a7de83802408321b74c322f8558db1679ac20",
    "0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49"); // second argument is web3.sha3("xyz")
console.log(result); // "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"


------------------------------------------------------------------------------

web3.eth.call
=====================

.. code-block:: javascript

    web3.eth.call(callObject [, defaultBlock] [, callback])

Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.

----------
Parameters
----------

1. ``Object`` - A transaction object see :ref:`web3.eth.sendTransaction <eth-sendtransaction>`, with the difference that for calls the ``from`` property is optional as well.
2. ``"Number|String"`` - (optional) If you pass this parameter it will not use the default block set with :ref:`web3.eth.defaultBlock <eth-defaultblock>`.
3. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``String``: The returned data of the call, e.g. a codes functions return value.

-------
Example
-------


.. code-block:: javascript

var result = web3.eth.call({
    to: "0xc4abd0339eb8d57087278718986382264244252f",
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"


------------------------------------------------------------------------------

web3.eth.estimateGas
=====================

.. code-block:: javascript

    web3.eth.estimateGas(callObject [, callback])

Executes a message call or transaction, which is directly executed in the VM of the node, but never mined into the blockchain and returns the amount of the gas used.

----------
Parameters
----------


See :ref:`web3.eth.sendTransaction <eth-sendtransaction>`, except that all properties are optional.

-------
Returns
-------


``Number`` - the used gas for the simulated call/transaction.

-------
Example
-------


.. code-block:: javascript

var result = web3.eth.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f",
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"


------------------------------------------------------------------------------

web3.eth.filter
=====================

.. code-block:: javascript

// can be 'latest' or 'pending'
var filter = web3.eth.filter(filterString);
// OR object are log filter options
var filter = web3.eth.filter(options);

// watch for changes
filter.watch(function(error, result){
  if (!error)
    console.log(result);
});

// Additionally you can start watching right away, by passing a callback:
web3.eth.filter(options, function(error, result){
  if (!error)
    console.log(result);
});


----------
Parameters
----------


1. ``"String|Object"`` - The string ``"latest"`` or ``"pending"`` to watch for changes in the latest block or pending transactions respectively. Or a filter options object as follows:
  * ``fromBlock``: ``"Number|String"`` - The number of the genesis block (`latest` may be given to mean the most recent and ``pending`` currently mining, block). By default ``latest``.
  * ``toBlock``: ``"Number|String"`` - The number of the latest block (`latest` may be given to mean the most recent and ``pending`` currently mining, block). By default ``latest``.
  * ``address``: ``String`` - An address or a list of addresses to only get logs from particular account(s).
  * ``topics``: `Array of Strings` - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use ``null``, e.g. `[null, '0x00...']`. You can also pass another array for each topic with options for that topic e.g. `[null, ['option1', 'option2']]`

-------
Returns
-------


``Object`` - A filter object with the following methods:

  * `filter.get(callback)`: Returns all of the log entries that fit the filter.
  * `filter.watch(callback)`: Watches for state changes that fit the filter and calls the callback. See [this note](#using-callbacks) for details.
  * `filter.stopWatching()`: Stops the watch and uninstalls the filter in the node. Should always be called once it is done.

##### Watch callback return value

- ``String`` - When using the ``"latest"`` parameter, it returns the block hash of the last incoming block.
- ``String`` - When using the ``"pending"`` parameter, it returns a transaction hash of the most recent pending transaction.
- ``Object`` - When using manual filter options, it returns a log object as follows:
    - ``logIndex``: ``Number`` - integer of the log index position in the block. ``null`` when its pending log.
    - ``transactionIndex``: ``Number`` - integer of the transactions index position log was created from. ``null`` when its pending log.
    - ``transactionHash``: ``String``, 32 Bytes - hash of the transactions this log was created from. ``null`` when its pending log.
    - ``blockHash``: ``String``, 32 Bytes - hash of the block where this log was in. ``null`` when its pending. ``null`` when its pending log.
    - ``blockNumber``: ``Number`` - the block number where this log was in. ``null`` when its pending. ``null`` when its pending log.
    - ``address``: ``String``, 32 Bytes - address from which this log originated.
    - ``data``: ``String`` - contains one or more 32 Bytes non-indexed arguments of the log.
    - ``topics``: `Array of Strings` - Array of 0 to 4 32 Bytes ``DATA`` of indexed log arguments. (In *solidity*: The first topic is the *hash* of the signature of the event (e.g. `Deposit(address,bytes32,uint256)`), except if you declared the event with the ``anonymous`` specifier.)

**Note** For event filter return values see [Contract Events](#contract-events)

-------
Example
-------


.. code-block:: javascript

    var filter = web3.eth.filter('pending');

    filter.watch(function (error, log) {
      console.log(log); //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
    });

    // get all past logs again.
    var myResults = filter.get(function(error, logs){ ... });

    ...

    // stops and uninstalls the filter
    filter.stopWatching();



------------------------------------------------------------------------------

web3.eth.contract
=====================


TODO link to web3.eth.contract page


------------------------------------------------------------------------------

web3.eth.getCompilers
=====================

.. code-block:: javascript

    web3.eth.getCompilers([callback])

Gets a list of available compilers.

----------
Parameters
----------

1. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Array`` - An array of strings of available compilers.

-------
Example
-------


.. code-block:: javascript

var number = web3.eth.getCompilers();
console.log(number); // ["lll", "solidity", "serpent"]


------------------------------------------------------------------------------

web3.eth.compile.solidity
=====================

.. code-block:: javascript

    web3.eth.compile.solidity(sourceString [, callback])

Compiles solidity source code.

----------
Parameters
----------

1. ``String`` - The solidity source code.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``Object`` - Contract and compiler info.


-------
Example
-------


.. code-block:: javascript

    var source = "" +
        "contract test {\n" +
        "   function multiply(uint a) returns(uint d) {\n" +
        "       return a * 7;\n" +
        "   }\n" +
        "}\n";
    var compiled = web3.eth.compile.solidity(source);
    console.log(compiled);
    // {
      "test": {
        "code": "0x605280600c6000396000f3006000357c010000000000000000000000000000000000000000000000000000000090048063c6888fa114602e57005b60376004356041565b8060005260206000f35b6000600782029050604d565b91905056",
        "info": {
          "source": "contract test {\n\tfunction multiply(uint a) returns(uint d) {\n\t\treturn a * 7;\n\t}\n}\n",
          "language": "Solidity",
          "languageVersion": "0",
          "compilerVersion": "0.8.2",
          "abiDefinition": [
            {
              "constant": false,
              "inputs": [
                {
                  "name": "a",
                  "type": "uint256"
                }
              ],
              "name": "multiply",
              "outputs": [
                {
                  "name": "d",
                  "type": "uint256"
                }
              ],
              "type": "function"
            }
          ],
          "userDoc": {
            "methods": {}
          },
          "developerDoc": {
            "methods": {}
          }
        }
      }
    }


------------------------------------------------------------------------------

web3.eth.compile.lll
=====================

.. code-block:: javascript

    web3. eth.compile.lll(sourceString [, callback])

Compiles LLL source code.

----------
Parameters
----------

1. ``String`` - The LLL source code.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``String`` - The compiled LLL code as HEX string.


-------
Example
-------


.. code-block:: javascript

    var source = "...";

    var code = web3.eth.compile.lll(source);
    console.log(code); // "0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056"


------------------------------------------------------------------------------

web3.eth.compile.serpent
=====================

.. code-block:: javascript

    web3.eth.compile.serpent(sourceString [, callback])

Compiles serpent source code.

----------
Parameters
----------

1. ``String`` - The serpent source code.
2. ``Function`` - (optional) Optional callback, returns an error object as first parameter and the result as second.

-------
Returns
-------


``String`` - The compiled serpent code as HEX string.


.. code-block:: javascript

    var source = "...";

    var code = web3.eth.compile.serpent(source);
    console.log(code); // "0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056"


------------------------------------------------------------------------------

web3.eth.namereg
=====================

.. code-block:: javascript

    web3.eth.namereg

Returns GlobalRegistrar object.

##### Usage

see [namereg](https://github.com/ethereum/web3.js/blob/master/example/namereg.html) example.

------------------------------------------------------------------------------

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

------------------------------------------------------------------------------

web3.eth.sendIBANTransaction
=====================

.. code-block:: javascript

var txHash = web3.eth.sendIBANTransaction('0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', 'XE81ETHXREGGAVOFYORK', 0x100);


Sends IBAN transaction from user account to destination IBAN address.

----------
Parameters
----------

- ``string`` - address from which we want to send transaction
- ``string`` - IBAN address to which we want to send transaction
- ``value`` - value that we want to send in IBAN transaction

------------------------------------------------------------------------------

web3.eth.iban
=====================

.. code-block:: javascript

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");


------------------------------------------------------------------------------

web3.eth.iban.fromAddress
=====================

.. code-block:: javascript

var i = web3.eth.iban.fromAddress('0x00c5496aee77c1ba1f0854206a26dda82a81d6d8');
console.log(i.toString()); // 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS


------------------------------------------------------------------------------

web3.eth.iban.fromBban
=====================

.. code-block:: javascript

var i = web3.eth.iban.fromBban('ETHXREGGAVOFYORK');
console.log(i.toString()); // "XE81ETHXREGGAVOFYORK"


------------------------------------------------------------------------------

web3.eth.iban.createIndirect
=====================

.. code-block:: javascript

var i = web3.eth.iban.createIndirect({
  institution: "XREG",
  identifier: "GAVOFYORK"
});
console.log(i.toString()); // "XE81ETHXREGGAVOFYORK"


------------------------------------------------------------------------------

web3.eth.iban.isValid
=====================

.. code-block:: javascript

var valid = web3.eth.iban.isValid("XE81ETHXREGGAVOFYORK");
console.log(valid); // true

var valid2 = web3.eth.iban.isValid("XE82ETHXREGGAVOFYORK");
console.log(valid2); // false, cause checksum is incorrect

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var valid3 = i.isValid();
console.log(valid3); // true



------------------------------------------------------------------------------

web3.eth.iban.isDirect
=====================

.. code-block:: javascript

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var direct = i.isDirect();
console.log(direct); // false


------------------------------------------------------------------------------

web3.eth.iban.isIndirect
=====================

.. code-block:: javascript

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var indirect = i.isIndirect();
console.log(indirect); // true


------------------------------------------------------------------------------

web3.eth.iban.checksum
=====================

.. code-block:: javascript

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var checksum = i.checksum();
console.log(checksum); // "81"


------------------------------------------------------------------------------

web3.eth.iban.institution
=====================

.. code-block:: javascript

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var institution = i.institution();
console.log(institution); // 'XREG'


------------------------------------------------------------------------------

web3.eth.iban.client
=====================

.. code-block:: javascript

var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var client = i.client();
console.log(client); // 'GAVOFYORK'


------------------------------------------------------------------------------

web3.eth.iban.address
=====================

.. code-block:: javascript

var i = new web3.eth.iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
var address = i.address();
console.log(address); // '00c5496aee77c1ba1f0854206a26dda82a81d6d8'


------------------------------------------------------------------------------

web3.eth.iban.toString
=====================

.. code-block:: javascript

var i = new web3.eth.iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
console.log(i.toString()); // 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'

