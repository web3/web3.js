<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Contents**

- [Web3 JavaScript app API for 0.2x.x](#web3-javascript-app-api-for-02xx)
  - [Getting Started](#getting-started)
    - [Using callbacks](#using-callbacks)
    - [Batch requests](#batch-requests)
    - [A note on big numbers in web3.js](#a-note-on-big-numbers-in-web3js)
  - [Web3.js API Reference](#web3js-api-reference)
      - [web3.version.api](#web3versionapi)
        - [Returns](#returns)
        - [Example](#example)
      - [web3.version.node](#web3versionnode)
        - [Returns](#returns-1)
        - [Example](#example-1)
      - [web3.version.network](#web3versionnetwork)
        - [Returns](#returns-2)
        - [Example](#example-2)
      - [web3.version.ethereum](#web3versionethereum)
        - [Returns](#returns-3)
        - [Example](#example-3)
      - [web3.version.whisper](#web3versionwhisper)
        - [Returns](#returns-4)
        - [Example](#example-4)
      - [web3.isConnected](#web3isconnected)
        - [Parameters](#parameters)
        - [Returns](#returns-5)
        - [Example](#example-5)
      - [web3.setProvider](#web3setprovider)
        - [Parameters](#parameters-1)
        - [Returns](#returns-6)
        - [Example](#example-6)
      - [web3.currentProvider](#web3currentprovider)
        - [Returns](#returns-7)
        - [Example](#example-7)
      - [web3.reset](#web3reset)
        - [Parameters](#parameters-2)
      - [web3.toHex](#web3tohex)
        - [Parameters](#parameters-3)
      - [web3.fromAscii](#web3fromascii)
        - [Parameters](#parameters-4)
      - [web3.fromDecimal](#web3fromdecimal)
        - [Parameters](#parameters-5)
      - [web3.toWei](#web3towei)
      - [web3.isAddress](#web3isaddress)
        - [Parameters](#parameters-6)
      - [web3.net.peerCount](#web3netpeercount)
        - [Returns](#returns-8)
        - [Example](#example-8)
    - [web3.eth](#web3eth)
        - [Example](#example-9)
      - [web3.eth.defaultAccount](#web3ethdefaultaccount)
      - [web3.eth.syncing](#web3ethsyncing)
        - [Returns](#returns-9)
      - [web3.eth.coinbase](#web3ethcoinbase)
        - [Returns](#returns-10)
        - [Example](#example-10)
      - [web3.eth.mining](#web3ethmining)
        - [Returns](#returns-11)
        - [Example](#example-11)
      - [web3.eth.hashrate](#web3ethhashrate)
        - [Returns](#returns-12)
        - [Example](#example-12)
      - [web3.eth.gasPrice](#web3ethgasprice)
        - [Returns](#returns-13)
        - [Example](#example-13)
      - [web3.eth.accounts](#web3ethaccounts)
        - [Returns](#returns-14)
        - [Example](#example-14)
      - [web3.eth.blockNumber](#web3ethblocknumber)
        - [Returns](#returns-15)
        - [Example](#example-15)
      - [web3.eth.register](#web3ethregister)
        - [Parameters](#parameters-7)
      - [web3.eth.getBalance](#web3ethgetbalance)
        - [Parameters](#parameters-8)
      - [web3.eth.getCode](#web3ethgetcode)
        - [Parameters](#parameters-9)
      - [web3.eth.getBlockTransactionCount](#web3ethgetblocktransactioncount)
        - [Parameters](#parameters-10)
        - [web3.eth.getTransaction](#web3ethgettransaction)
        - [Parameters](#parameters-11)
      - [web3.eth.getTransactionCount](#web3ethgettransactioncount)
        - [Parameters](#parameters-12)
      - [web3.eth.sendRawTransaction](#web3ethsendrawtransaction)
        - [Parameters](#parameters-13)
      - [web3.eth.call](#web3ethcall)
        - [Parameters](#parameters-14)
      - [web3.eth.filter](#web3ethfilter)
        - [Parameters](#parameters-15)
        - [Example](#example-16)
      - [Contract Methods](#contract-methods)
        - [Parameters](#parameters-16)
        - [Parameters](#parameters-17)
        - [Parameters](#parameters-18)
      - [web3.eth.compile.solidity](#web3ethcompilesolidity)
        - [Parameters](#parameters-19)
      - [web3.eth.compile.serpent](#web3ethcompileserpent)
        - [Parameters](#parameters-20)
      - [web3.db.getString](#web3dbgetstring)
        - [Parameters](#parameters-21)
      - [web3.db.putHex](#web3dbputhex)
        - [Parameters](#parameters-22)
      - [web3.db.getHex](#web3dbgethex)
        - [Parameters](#parameters-23)
    - [web3.shh](#web3shh)
        - [Example](#example-17)
      - [web3.shh.post](#web3shhpost)
        - [Parameters](#parameters-24)
      - [web3.shh.hasIdentity](#web3shhhasidentity)
        - [Parameters](#parameters-25)
      - [web3.shh.addToGroup](#web3shhaddtogroup)
        - [Example](#example-18)
      - [web3.shh.filter](#web3shhfilter)
        - [Parameters](#parameters-26)
      - [web3.eth.iban.fromAddress](#web3ethibanfromaddress)
      - [web3.eth.iban.fromBban](#web3ethibanfrombban)
      - [web3.eth.iban.createIndirect](#web3ethibancreateindirect)
      - [web3.eth.iban.isValid](#web3ethibanisvalid)
      - [web3.eth.iban.isDirect](#web3ethibanisdirect)
      - [web3.eth.iban.isIndirect](#web3ethibanisindirect)
      - [web3.eth.iban.checksum](#web3ethibanchecksum)
      - [web3.eth.iban.institution](#web3ethibaninstitution)
      - [web3.eth.iban.client](#web3ethibanclient)
      - [web3.eth.iban.address](#web3ethibanaddress)
      - [web3.eth.iban.toString](#web3ethibantostring)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
 # Web3 JavaScript app API for 0.2x.x
 **NOTE: These docs are for web3.js version 0.2x.x. If you’re using web3.js 1.x please refer to [this documentation](https://web3js.readthedocs.io/en/latest/).**
 To make your app work on Ethereum, you can use the `web3` object provided by the [web3.js library](https://github.com/ethereum/web3.js). Under the hood it communicates to a local node through [RPC calls](https://github.com/ethereum/wiki/wiki/JSON-RPC). web3.js works with any Ethereum node which exposes an RPC layer.
 `web3` contains the `eth` object - `web3.eth` (for specifically Ethereum blockchain interactions) and the `shh` object - `web3.shh` (for Whisper interaction). Over time we'll introduce other objects for each of the other web3 protocols. Working  [examples can be found here](https://github.com/ethereum/web3.js/tree/master/example).
 If you want to look at some more sophisticated examples using web3.js check out these [useful app patterns](https://github.com/ethereum/wiki/wiki/Useful-Ðapp-Patterns).
 ## Getting Started
 * [Adding web3](#adding-web3)
* [Using Callbacks](#using-callbacks)
* [Batch requests](#batch-requests)
* [A note on big numbers in web3.js](#a-note-on-big-numbers-in-web3js)
* [-> API Reference](#web3js-api-reference)
 ### Adding web3
 First you need to get web3.js into your project. This can be done using the following methods:
 - npm: `npm install web3`
- bower: `bower install web3`
- meteor: `meteor add ethereum:web3`
- vanilla: link the `dist./web3.min.js`  

Then you need to create a web3 instance, setting a provider.
To make sure you don't overwrite the already set provider when in mist, check first if the web3 is available:
 ```js
if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
```
 After that you can use the [API](web3js-api-reference) of the `web3` object.
 ### Using callbacks
 As this API is designed to work with a local RPC node, all its functions use synchronous HTTP requests by default.
 If you want to make an asynchronous request, you can pass an optional callback as the last parameter to most functions.
All callbacks are using an [error first callback](http://fredkschott.com/post/2014/03/understanding-error-first-callbacks-in-node-js/) style:
 ```js
web3.eth.getBlock(48, function(error, result){
    if(!error)
        console.log(JSON.stringify(result));
    else
        console.error(error);
})
```
 ### Batch requests
 Batch requests allow queuing up requests and processing them at once.
 **Note** Batch requests are not faster! In fact making many requests at once will in some cases be faster, as requests are processed asynchronously. Batch requests are mainly useful to ensure the serial processing of requests.
 ```js
var batch = web3.createBatch();
batch.add(web3.eth.getBalance.request('0x0000000000000000000000000000000000000000', 'latest', callback));
batch.add(web3.eth.contract(abi).at(address).balance.request(address, callback2));
batch.execute();
```
 ### A note on big numbers in web3.js
 You will always get a BigNumber object for number values as JavaScript is not able to handle big numbers correctly.
Look at the following examples:
 ```js
"101010100324325345346456456456456456456"
// "101010100324325345346456456456456456456"
101010100324325345346456456456456456456
// 1.0101010032432535e+38
```
 web3.js depends on the [BigNumber Library](https://github.com/MikeMcl/bignumber.js/) and adds it automatically.
 ```js
var balance = new BigNumber('131242344353464564564574574567456');
// or var balance = web3.eth.getBalance(someAddress);
 balance.plus(21).toString(10); // toString(10) converts it to a number string
// "131242344353464564564574574567477"
```
 The next example wouldn't work as we have more than 20 floating points, therefore it is recommended to always keep your balance in *wei* and only transform it to other units when presenting to the user:
```js
var balance = new BigNumber('13124.234435346456466666457455567456');
 balance.plus(21).toString(10); // toString(10) converts it to a number string, but can only show upto 20 digits
// "13124.23443534645646666646" // your number will be truncated after the 20th digit
```
 ## Web3.js API Reference
 * [web3](#web3)
  * [version](#web3versionapi)
     * [api](#web3versionapi)
     * [node/getNode](#web3versionnode)
     * [network/getNetwork](#web3versionnetwork)
     * [ethereum/getEthereum](#web3versionethereum)
     * [whisper/getWhisper](#web3versionwhisper)
  * [isConnected()](#web3isconnected)
  * [setProvider(provider)](#web3setprovider)
  * [currentProvider](#web3currentprovider)
  * [reset()](#web3reset)
  * [sha3(string, options)](#web3sha3)
  * [toHex(stringOrNumber)](#web3tohex)
  * [toAscii(hexString)](#web3toascii)
  * [fromAscii(textString)](#web3fromascii)
  * [toDecimal(hexString)](#web3todecimal)
  * [fromDecimal(number)](#web3fromdecimal)
  * [fromWei(numberStringOrBigNumber, unit)](#web3fromwei)
  * [toWei(numberStringOrBigNumber, unit)](#web3towei)
  * [toBigNumber(numberOrHexString)](#web3tobignumber)
  * [isAddress(hexString)](#web3isaddress)
  * [net](#web3net)
    * [listening/getListening](#web3netlistening)
    * [peerCount/getPeerCount](#web3netpeercount)
  * [eth](#web3eth)
    * [defaultAccount](#web3ethdefaultaccount)
    * [defaultBlock](#web3ethdefaultblock)
    * [syncing/getSyncing](#web3ethsyncing)
    * [isSyncing](#web3ethissyncing)
    * [coinbase/getCoinbase](#web3ethcoinbase)
    * [hashrate/getHashrate](#web3ethhashrate)
    * [gasPrice/getGasPrice](#web3ethgasprice)
    * [accounts/getAccounts](#web3ethaccounts)
    * [mining/getMining](#web3ethmining)
    * [blockNumber/getBlockNumber](#web3ethblocknumber)
    * [register(hexString)](#web3ethregister) (Not implemented yet)
    * [unRegister(hexString)](#web3ethunregister) (Not implemented yet)
    * [getBalance(address)](#web3ethgetbalance)
    * [getStorageAt(address, position)](#web3ethgetstorageat)
    * [getCode(address)](#web3ethgetcode)
    * [getBlock(hash/number)](#web3ethgetblock)
    * [getBlockTransactionCount(hash/number)](#web3ethgetblocktransactioncount)
    * [getUncle(hash/number)](#web3ethgetuncle)
    * [getBlockUncleCount(hash/number)](#web3ethgetblockunclecount)
    * [getTransaction(hash)](#web3ethgettransaction)
    * [getTransactionFromBlock(hashOrNumber, indexNumber)](#web3ethgettransactionfromblock)
    * [getTransactionReceipt(hash)](#web3ethgettransactionreceipt)
    * [getTransactionCount(address)](#web3ethgettransactioncount)
    * [sendTransaction(object)](#web3ethsendtransaction)
    * [sendRawTransaction(object)](#web3ethsendrawtransaction)
    * [sign(object)](#web3ethsign)
    * [call(object)](#web3ethcall)
    * [estimateGas(object)](#web3ethestimategas)
    * [filter(array (, options) )](#web3ethfilter)
        - [watch(callback)](#web3ethfilter)
        - [stopWatching(callback)](#web3ethfilter)
        - [get()](#web3ethfilter)
    * [Contract(abiArray)](#web3ethcontract)
    * [contract.myMethod()](#contract-methods)
    * [contract.myEvent()](#contract-events)
    * [contract.allEvents()](#contract-allevents)
    * [getCompilers()](#web3ethgetcompilers)
    * [compile.lll(string)](#web3ethcompilelll)
    * [compile.solidity(string)](#web3ethcompilesolidity)
    * [compile.serpent(string)](#web3ethcompileserpent)
    * [namereg](#web3ethnamereg)
    * [sendIBANTransaction](#web3ethsendibantransaction)
    * [iban](#web3ethiban)
      * [fromAddress](#web3ethibanfromaddress)
      * [fromBban](#web3ethibanfrombban)
      * [createIndirect](#web3ethibancreateindirect)
      * [isValid](#web3ethibanisvalid)
      * [isDirect](#web3ethibanisdirect)
      * [isIndirect](#web3ethibanisindirect)
      * [checksum](#web3ethibanchecksum)
      * [institution](#web3ethibaninstitution)
      * [client](#web3ethibanclient)
      * [address](#web3ethibanaddress)
      * [toString](#web3ethibantostring)
  * [db](#web3db)
    * [putString(name, key, value)](#web3dbputstring)
    * [getString(-       var rXArray = stringToNumberArray(form.rX.value);
name, key)](#web3dbgetstring)
    * [putHex(name, key, value)](#web3dbputhex)
    * [getHex(name, key)](#web3dbgethex)
  * [shh](#web3shh)
    * [post(postObject)](#web3shhpost)
    * [newIdentity()](#web3shhnewidentity)
    * [hasIdentity(hexString)](#web3shhhaveidentity)
    * [newGroup(_id, _who)](#web3shhnewgroup)
    * [addToGroup(_id, _who)](#web3shhaddtogroup)
    * [filter(object/string)](#web3shhfilter)
      * [watch(callback)](#web3shhfilter)
      * [stopWatching(callback)](#web3shhfilter)
      * [get(callback)](#web3shhfilter)
 ### Usage
 #### web3
The `web3` object provides all methods.
 ##### Example
 ```js
var Web3 = require('web3');
// create an instance of web3 using the HTTP provider.
// NOTE in mist web3 is already available, so check first if it's available before instantiating
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
```
 ###### Example using HTTP Basic Authentication
```js
var Web3 = require('web3');
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545", 0, BasicAuthUsername, BasicAuthPassword));
//Note: HttpProvider takes 4 arguments (host, timeout, user, password)
```
 ***
 #### web3.version.api
 ```js
web3.version.api
```
 ##### Returns
 `String` - The ethereum js api version.
 ##### Example
 ```js
var version = web3.version.api;
console.log(version); // "0.2.0"
```
 ***
 #### web3.version.node
     web3.version.node
    // or async
    web3.version.getNode(callback(error, result){ ... })
 ##### Returns
 `String` - The client/node version.
 ##### Example
 ```js
var version = web3.version.node;
console.log(version); // "Mist/v0.9.3/darwin/go1.4.1"
```
 ***
 #### web3.version.network
     web3.version.network
    // or async
    web3.version.getNetwork(callback(error, result){ ... })
 ##### Returns
 `String` - The network protocol version.
 ##### Example
 ```js
var version = web3.version.network;
console.log(version); // 54
```
 ***
 #### web3.version.ethereum
     web3.version.ethereum
    // or async
    web3.version.getEthereum(callback(error, result){ ... })
 ##### Returns
 `String` - The ethereum protocol version.
 ##### Example
 ```js
var version = web3.version.ethereum;
console.log(version); // 60
```
 ***
 #### web3.version.whisper
     web3.version.whisper
    // or async
    web3.version.getWhisper(callback(error, result){ ... })
 ##### Returns
 `String` - The whisper protocol version.
 ##### Example
 ```js
var version = web3.version.whisper;
console.log(version); // 20
```
 ***
#### web3.isConnected
     web3.isConnected()
 Should be called to check if a connection to a node exists
 ##### Parameters
none
 ##### Returns
 `Boolean`
 ##### Example
 ```js
if(!web3.isConnected()) {
  
   // show some dialog to ask the user to start a node
 } else {
 
   // start web3 filters, calls, etc
  
}
```
 ***
 #### web3.setProvider
     web3.setProvider(provider)
 Should be called to set provider.
 ##### Parameters
none
 ##### Returns
 `undefined`
 ##### Example
 ```js
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545')); // 8080 for cpp/AZ, 8545 for go/mist
```
 ***
 #### web3.currentProvider
     web3.currentProvider
 Will contain the current provider, if one is set. This can be used to check if mist etc. has set already a provider.
 ##### Returns
 `Object` - The provider set or `null`;
 ##### Example
 ```js
// Check if mist etc. already set a provider
if(!web3.currentProvider)
    web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));
 ```
 ***
 #### web3.reset
     web3.reset(keepIsSyncing)
 Should be called to reset state of web3. Resets everything except manager. Uninstalls all filters. Stops polling.
 ##### Parameters
 1. `Boolean` - If `true` it will uninstall all filters, but will keep the [web3.eth.isSyncing()](#web3ethissyncing) polls
 ##### Returns
 `undefined`
 ##### Example
 ```js
web3.reset();
```
 ***
 #### web3.sha3
     web3.sha3(string [, options])
 ##### Parameters
 1. `String` - The string to hash using the Keccak-256 SHA3 algorithm
1. `Object` - (optional) Set `encoding` to `hex` if the string to hash is encoded in hex. A leading `0x` will be automatically ignored.
 ##### Returns
 `String` - The Keccak-256 SHA3 of the given data.
 ##### Example
 ```js
var hash = web3.sha3("Some string to be hashed");
console.log(hash); // "0xed973b234cf2238052c9ac87072c71bcf33abc1bbd721018e0cca448ef79b379"
 var hashOfHash = web3.sha3(hash, {encoding: 'hex'});
console.log(hashOfHash); // "0x85dd39c91a64167ba20732b228251e67caed1462d4bcf036af88dc6856d0fdcc"
```
 ***
 #### web3.toHex
     web3.toHex(mixed);
 
Converts any value into HEX.
 ##### Parameters
 1. `String|Number|Object|Array|BigNumber` - The value to parse to HEX. If its an object or array it will be `JSON.stringify` first. If its a BigNumber it will make it the HEX value of a number.
 ##### Returns
 `String` - The hex string of `mixed`.
 ##### Example
 ```js
var str = web3.toHex({test: 'test'});
console.log(str); // '0x7b2274657374223a2274657374227d'
```
 ***
 #### web3.toAscii
     web3.toAscii(hexString);
 Converts a HEX string into a ASCII string.
 ##### Parameters
 1. `String` - A HEX string to be converted to ascii.
 ##### Returns
 `String` - An ASCII string made from the given `hexString`.
 ##### Example
 ```js
var str = web3.toAscii("0x657468657265756d000000000000000000000000000000000000000000000000");
console.log(str); // "ethereum"
```
 ***
 #### web3.fromAscii
     web3.fromAscii(string);
 Converts any ASCII string to a HEX string.
 ##### Parameters
 1. `String` - An ASCII string to be converted to HEX.
 ##### Returns
 `String` - The converted HEX string.
 ##### Example
 ```js
var str = web3.fromAscii('ethereum');
console.log(str); // "0x657468657265756d"
```
 ***
 #### web3.toDecimal
     web3.toDecimal(hexString);
 Converts a HEX string to its number representation.
 ##### Parameters
 1. `String` - A HEX string to be converted to a number.
 ##### Returns
 `Number` - The number representing the data `hexString`.
 ##### Example
 ```js
var number = web3.toDecimal('0x15');
console.log(number); // 21
```
 ***
 #### web3.fromDecimal
     web3.fromDecimal(number);
 Converts a number or number string to its HEX representation.
 ##### Parameters
 1. `Number|String` - A number to be converted to a HEX string.
 ##### Returns
 `String` - The HEX string representing of the given `number`.
 ##### Example
 ```js
var value = web3.fromDecimal('21');
console.log(value); // "0x15"
```
 ***
 #### web3.fromWei
     web3.fromWei(number, unit)
 Converts a number of wei into the following ethereum units:
 - `Gwei`
- `Kwei`
- `Mwei`/`babbage`/`ether`/`femtoether`
- `ether`
- `finney`/`gether`/grand/`gwei`
- `kether`/`kwei`/`lovelace`/`mether`/`micro`
- `microether`/`milli`/`milliether`
- `mwei`/`nano`/`nanoether`
- `noether`
- `picoether`/`shannon`
- `szabo`
- `tether`
- `wei`
 ##### Parameters
 1. `Number|String|BigNumber` - A number or BigNumber instance.
2. `String` - One of the above ether units.
 ##### Returns
 `String|BigNumber` - Either a number string, or a BigNumber instance, depending on the given `number` parameter.
 ##### Example
 ```js
var value = web3.fromWei('21000000000000', 'finney');
console.log(value); // "0.021"
```
 ***
 #### web3.toWei
     web3.toWei(number, unit)
 Converts an ethereum unit into wei. Possible units are:
 - `kwei`/`ada`
- `mwei`/`babbage`
- `gwei`/`shannon`
- `szabo`
- `finney`
- `ether`
- `kether`/`grand`/`einstein`
- `mether`
- `gether`
- `tether`
 ##### Parameters
 1. `Number|String|BigNumber` - A number or BigNumber instance.
2. `String` - One of the above ether units.
 ##### Returns
 `String|BigNumber` - Either a number string, or a BigNumber instance, depending on the given `number` parameter.
 ##### Example
 ```js
var value = web3.toWei('1', 'ether');
console.log(value); // "1000000000000000000"
```
 ***
 #### web3.toBigNumber
     web3.toBigNumber(numberOrHexString);
 Converts a given number into a BigNumber instance.
 See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).
 ##### Parameters
 1. `Number|String` - A number, number string or HEX string of a number.
 ##### Returns
 `BigNumber` - A BigNumber instance representing the given value.
 ##### Example
 ```js
var value = web3.toBigNumber('200000000000000000000001');
console.log(value); // instanceOf BigNumber
console.log(value.toNumber()); // 2.0000000000000002e+23
console.log(value.toString(10)); // '200000000000000000000001'
```
 ***
 #### web3.isAddress
     web3.isAddress(HexString);
 Checks if the given string is an address.
 ##### Parameters
 1. `String` - A HEX string.
 ##### Returns
 `Boolean` - `false` if it's not on a valid address format. Returns `true` if it's an all lowercase or all uppercase valid address. If it's a mixed case address, it checks using `web3.isChecksumAddress()`.
 ##### Example
 ```js
var isAddress = web3.isAddress("0x8888f1f195afa192cfee860698584c030f4c9db1");
console.log(isAddress); // true
```
 ***
 ### web3.net
 #### web3.net.listening
     web3.net.listening
    // or async
    web3.net.getListening(callback(error, result){ ... })
 This property is read only and says whether the node is actively listening for network connections or not.
 ##### Returns
 `Boolean` - `true` if the client is actively listening for network connections, otherwise `false`.
 ##### Example
 ```js
var listening = web3.net.listening;
console.log(listening); // true of false
```
 ***
 #### web3.net.peerCount
     web3.net.peerCount
    // or async
    web3.net.getPeerCount(callback(error, result){ ... })
 This property is read only and returns the number of connected peers.
 ##### Returns
 `Number` - The number of peers currently connected to the client.
 ##### Example
 ```js
var peerCount = web3.net.peerCount;
console.log(peerCount); // 4
```
 ***
 ### web3.eth
 Contains the ethereum blockchain related methods.
 ##### Example
 ```js
var eth = web3.eth;
```
 ***
 #### web3.eth.defaultAccount
     web3.eth.defaultAccount
 This default address is used for the following methods (optionally you can overwrite it by specifying the `from` property):
 - [web3.eth.sendTransaction()](#web3ethsendtransaction)
- [web3.eth.call()](#web3ethcall)
 ##### Values
 `String`, 20 Bytes - Any address you own, or where you have the private key for.
 *Default is* `undefined`.
 ##### Returns
 `String`, 20 Bytes - The currently set default address.
 ##### Example
 ```js
var defaultAccount = web3.eth.defaultAccount;
console.log(defaultAccount); // ''
 // set the default account
web3.eth.defaultAccount = '0x8888f1f195afa192cfee860698584c030f4c9db1';
```
 ***
 #### web3.eth.defaultBlock
     web3.eth.defaultBlock
 This default block is used for the following methods (optionally you can override it by passing the defaultBlock parameter):
 - [web3.eth.getBalance()](#web3ethgetbalance)
- [web3.eth.getCode()](#web3ethgetcode)
- [web3.eth.getTransactionCount()](#web3ethgettransactioncount)
- [web3.eth.getStorageAt()](#web3ethgetstorageat)
- [web3.eth.call()](#web3ethcall)
- [contract.myMethod.call()](#contract-methods)
- [contract.myMethod.estimateGas()](#contract-methods)
 ##### Values
 Default block parameters can be one of the following:
 - `Number` - a block number
- `String` - `"earliest"`, the genesis block
- `String` - `"latest"`, the latest block (current head of the blockchain)
- `String` - `"pending"`, the currently mined block (including pending transactions)
 *Default is* `latest`
 ##### Returns
 `Number|String` - The default block number to use when querying a state.
 ##### Example
 ```js
var defaultBlock = web3.eth.defaultBlock;
console.log(defaultBlock); // 'latest'
 // set the default block
web3.eth.defaultBlock = 231;
```
 ***
 #### web3.eth.syncing
     web3.eth.syncing
    // or async
    web3.eth.getSyncing(callback(error, result){ ... })
 This property is read only and returns the either a sync object, when the node is syncing or `false`.
 ##### Returns
 `Object|Boolean` - A sync object as follows, when the node is currently syncing or `false`:
   - `startingBlock`: `Number` - The block number where the sync started.
   - `currentBlock`: `Number` - The block number where at which block the node currently synced to already.
   - `highestBlock`: `Number` - The estimated block number to sync to.
 ##### Example
 ```js
var sync = web3.eth.syncing;
console.log(sync);
/*
{
   startingBlock: 300,
   currentBlock: 312,
   highestBlock: 512
}
*/
```
 ***
 #### web3.eth.isSyncing
     web3.eth.isSyncing(callback);
 This convenience function calls the `callback` everytime a sync starts, updates and stops.
 ##### Returns
 `Object` - a isSyncing object with the following methods:
   * `syncing.addCallback()`: Adds another callback, which will be called when the node starts or stops syncing.
  * `syncing.stopWatching()`: Stops the syncing callbacks.
 ##### Callback return value
 - `Boolean` - The callback will be fired with `true` when the syncing starts and with `false` when it stopped.
- `Object` - While syncing it will return the syncing object:
   - `startingBlock`: `Number` - The block number where the sync started.
   - `currentBlock`: `Number` - The block number where at which block the node currently synced to already.
   - `highestBlock`: `Number` - The estimated block number to sync to.
 ##### Example
 ```js
web3.eth.isSyncing(function(error, sync){
    if(!error) {
        // stop all app activity
        if(sync === true) {
           // we use `true`, so it stops all filters, but not the web3.eth.syncing polling
           web3.reset(true);
        
        // show sync info
        } else if(sync) {
           console.log(sync.currentBlock);
        
        // re-gain app operation
        } else {
            // run your app init function...
        }
    }
});
```
 ***
 #### web3.eth.coinbase
     web3.eth.coinbase
    // or async
    web3.eth.getCoinbase(callback(error, result){ ... })
 This property is read only and returns the coinbase address where the mining rewards go to.
 ##### Returns
 `String` - The coinbase address of the client.
 ##### Example
 ```js
var coinbase = web3.eth.coinbase;
console.log(coinbase); // "0x407d73d8a49eeb85d32cf465507dd71d507100c1"
```
 ***
 #### web3.eth.mining
     web3.eth.mining
    // or async
    web3.eth.getMining(callback(error, result){ ... })
 This property is read only and says whether the node is mining or not.
 ##### Returns
 `Boolean` - `true` if the client is mining, otherwise `false`.
 ##### Example
 ```js
var mining = web3.eth.mining;
console.log(mining); // true or false
```
 ***
 #### web3.eth.hashrate
     web3.eth.hashrate
    // or async
    web3.eth.getHashrate(callback(error, result){ ... })
 This property is read only and returns the number of hashes per second that the node is mining with.
 ##### Returns
 `Number` - number of hashes per second.
 ##### Example
 ```js
var hashrate = web3.eth.hashrate;
console.log(hashrate); // 493736
```
 ***
 #### web3.eth.gasPrice
     web3.eth.gasPrice
    // or async
    web3.eth.getGasPrice(callback(error, result){ ... })
 This property is read only and returns the current gas price.
The gas price is determined by the x latest blocks median gas price.
 ##### Returns
 `BigNumber` - A BigNumber instance of the current gas price in wei.
 See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).
 ##### Example
 ```js
var gasPrice = web3.eth.gasPrice;
console.log(gasPrice.toString(10)); // "10000000000000"
```
 ***
 #### web3.eth.accounts
     web3.eth.accounts
    // or async
    web3.eth.getAccounts(callback(error, result){ ... })
 This property is read only and returns a list of accounts the node controls.
 ##### Returns
 `Array` - An array of addresses controlled by client.
 ##### Example
 ```js
var accounts = web3.eth.accounts;
console.log(accounts); // ["0x407d73d8a49eeb85d32cf465507dd71d507100c1"] 
```
 ***
 #### web3.eth.blockNumber
     web3.eth.blockNumber
    // or async
    web3.eth.getBlockNumber(callback(error, result){ ... })
 This property is read only and returns the current block number.
 ##### Returns
 `Number` - The number of the most recent block.
 ##### Example
 ```js
var number = web3.eth.blockNumber;
console.log(number); // 2744
```
 ***
 #### web3.eth.register
     web3.eth.register(addressHexString [, callback])
 (Not Implemented yet)
Registers the given address to be included in `web3.eth.accounts`. This allows non-private-key owned accounts to be associated as an owned account (e.g., contract wallets).
 ##### Parameters
 1. `String` - The address to register
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 ?
 ##### Example
 ```js
web3.eth.register("0x407d73d8a49eeb85d32cf465507dd71d507100ca")
```
 ***
 #### web3.eth.unRegister
      web3.eth.unRegister(addressHexString [, callback])
 (Not Implemented yet)
Unregisters a given address.
 ##### Parameters
 1. `String` - The address to unregister.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 ?
 ##### Example
 ```js
web3.eth.unregister("0x407d73d8a49eeb85d32cf465507dd71d507100ca")
```
 ***
 #### web3.eth.getBalance
     web3.eth.getBalance(addressHexString [, defaultBlock] [, callback])
 Get the balance of an address at a given block.
 ##### Parameters
 1. `String` - The address to get the balance of.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.eth.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - A BigNumber instance of the current balance for the given address in wei.
 See the [note on BigNumber](#a-note-on-big-numbers-in-web3js).
 ##### Example
 ```js
var balance = web3.eth.getBalance("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(balance); // instanceof BigNumber
console.log(balance.toString(10)); // '1000000000000'
console.log(balance.toNumber()); // 1000000000000
```
 ***
 #### web3.eth.getStorageAt
     web3.eth.getStorageAt(addressHexString, position [, defaultBlock] [, callback])
 Get the storage at a specific position of an address.
 ##### Parameters
 1. `String` - The address to get the storage from.
2. `Number` - The index position of the storage.
3. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.eth.defaultBlock](#web3ethdefaultblock).
4. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The value in storage at the given position.
 ##### Example
 ```js
var state = web3.eth.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0);
console.log(state); // "0x03"
```
 ***
 #### web3.eth.getCode
     web3.eth.getCode(addressHexString [, defaultBlock] [, callback])
 Get the code at a specific address.
 ##### Parameters
 1. `String` - The address to get the code from.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.eth.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The data at given address `addressHexString`.
 ##### Example
 ```js
var code = web3.eth.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8");
console.log(code); // "0x600160008035811a818181146012578301005b601b6001356025565b8060005260206000f25b600060078202905091905056"
```
 ***
 #### web3.eth.getBlock
      web3.eth.getBlock(blockHashOrBlockNumber [, returnTransactionObjects] [, callback])
 Returns a block matching the block number or block hash.
 ##### Parameters
 1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
2. `Boolean` - (optional, default `false`) If `true`, the returned block will contain all transactions as objects, if `false` it will only contains the transaction hashes.
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Object` - The block object:
   - `number`: `Number` - the block number. `null` when its pending block.
  - `hash`: `String`, 32 Bytes - hash of the block. `null` when its pending block.
  - `parentHash`: `String`, 32 Bytes - hash of the parent block.
  - `nonce`: `String`, 8 Bytes - hash of the generated proof-of-work. `null` when its pending block.
  - `sha3Uncles`: `String`, 32 Bytes - SHA3 of the uncles data in the block.
  - `logsBloom`: `String`, 256 Bytes - the bloom filter for the logs of the block. `null` when its pending block.
  - `transactionsRoot`: `String`, 32 Bytes - the root of the transaction trie of the block
  - `stateRoot`: `String`, 32 Bytes - the root of the final state trie of the block.
  - `miner`: `String`, 20 Bytes - the address of the beneficiary to whom the mining rewards were given.
  - `difficulty`: `BigNumber` - integer of the difficulty for this block.
  - `totalDifficulty`: `BigNumber` - integer of the total difficulty of the chain until this block.
  - `extraData`: `String` - the "extra data" field of this block.
  - `size`: `Number` - integer the size of this block in bytes.
  - `gasLimit`: `Number` - the maximum gas allowed in this block.
  - `gasUsed`: `Number` - the total used gas by all transactions in this block.
  - `timestamp`: `Number` - the unix timestamp for when the block was collated.
  - `transactions`: `Array` - Array of transaction objects, or 32 Bytes transaction hashes depending on the last given parameter.
  - `uncles`: `Array` - Array of uncle hashes.
 ##### Example
 ```js
var info = web3.eth.getBlock(3150);
console.log(info);
/*
{
  "number": 3,
  "hash": "0xef95f2f1ed3ca60b048b4bf67cde2195961e0bba6f70bcbea9a2c4e133e34b46",
  "parentHash": "0x2302e1c0b972d00932deb5dab9eb2982f570597d9d42504c05d9c2147eaf9c88",
  "nonce": "0xfb6e1a62d119228b",
  "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
  "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
  "transactionsRoot": "0x3a1b03875115b79539e5bd33fb00d8f7b7cd61929d5a3c574f507b8acf415bee",
  "stateRoot": "0xf1133199d44695dfa8fd1bcfe424d82854b5cebef75bddd7e40ea94cda515bcb",
  "miner": "0x8888f1f195afa192cfee860698584c030f4c9db1",
  "difficulty": BigNumber,
  "totalDifficulty": BigNumber,
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
*/
```
 ***
 #### web3.eth.getBlockTransactionCount
     web3.eth.getBlockTransactionCount(hashStringOrBlockNumber [, callback])
 Returns the number of transaction in a given block.
 ##### Parameters
 1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Number` - The number of transactions in the given block.
 ##### Example
 ```js
var number = web3.eth.getBlockTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1
```
 ***
 #### web3.eth.getUncle
     web3.eth.getUncle(blockHashStringOrNumber, uncleNumber [, returnTransactionObjects] [, callback])
 Returns a blocks uncle by a given uncle index position.
 ##### Parameters
 1. `String|Number` - The block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
2. `Number` - The index position of the uncle.
3. `Boolean` - (optional, default `false`) If `true`, the returned block will contain all transactions as objects, if `false` it will only contains the transaction hashes.
4. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Object` - the returned uncle. For a return value see [web3.eth.getBlock()](#web3ethgetblock).
 **Note**: An uncle doesn't contain individual transactions.
 ##### Example
 ```js
var uncle = web3.eth.getUncle(500, 0);
console.log(uncle); // see web3.eth.getBlock
 ```
 ***
 ##### web3.eth.getTransaction
     web3.eth.getTransaction(transactionHash [, callback])
 Returns a transaction matching the given transaction hash.
 ##### Parameters
 1. `String` - The transaction hash.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Object` - A transaction object its hash `transactionHash`:
   - `hash`: `String`, 32 Bytes - hash of the transaction.
  - `nonce`: `Number` - the number of transactions made by the sender prior to this one.
  - `blockHash`: `String`, 32 Bytes - hash of the block where this transaction was in. `null` when its pending.
  - `blockNumber`: `Number` - block number where this transaction was in. `null` when its pending.
  - `transactionIndex`: `Number` - integer of the transactions index position in the block. `null` when its pending.
  - `from`: `String`, 20 Bytes - address of the sender.
  - `to`: `String`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `value`: `BigNumber` - value transferred in Wei.
  - `gasPrice`: `BigNumber` - gas price provided by the sender in Wei.
  - `gas`: `Number` - gas provided by the sender.
  - `input`: `String` - the data sent along with the transaction.
 ##### Example
 ```js
var transaction = web3.eth.getTransaction('0x9fc76417374aa880d4449a1f7f31ec597f00b1f6f3dd2d66f4c9c6c445836d8b');
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
 ```
 ***
 #### web3.eth.getTransactionFromBlock
     getTransactionFromBlock(hashStringOrNumber, indexNumber [, callback])
 Returns a transaction based on a block hash or number and the transactions index position.
 ##### Parameters
 1. `String` - A block number or hash. Or the string `"earliest"`, `"latest"` or `"pending"` as in the [default block parameter](#web3ethdefaultblock).
2. `Number` - The transactions index position.
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Object` - A transaction object, see [web3.eth.getTransaction](#web3ethgettransaction):
 ##### Example
 ```js
var transaction = web3.eth.getTransactionFromBlock('0x4534534534', 2);
console.log(transaction); // see web3.eth.getTransaction
 ```
 ***
 #### web3.eth.getTransactionReceipt
     web3.eth.getTransactionReceipt(hashString [, callback])
 Returns the receipt of a transaction by transaction hash.
 **Note** That the receipt is not available for pending transactions.
 ##### Parameters
 1. `String` - The transaction hash.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Object` - A transaction receipt object, or `null` when no receipt was found:
   - `blockHash`: `String`, 32 Bytes - hash of the block where this transaction was in.
  - `blockNumber`: `Number` - block number where this transaction was in.
  - `transactionHash`: `String`, 32 Bytes - hash of the transaction.
  - `transactionIndex`: `Number` - integer of the transactions index position in the block.
  - `from`: `String`, 20 Bytes - address of the sender.
  - `to`: `String`, 20 Bytes - address of the receiver. `null` when its a contract creation transaction.
  - `cumulativeGasUsed `: `Number ` - The total amount of gas used when this transaction was executed in the block.
  - `gasUsed `: `Number ` -  The amount of gas used by this specific transaction alone.
  - `contractAddress `: `String` - 20 Bytes - The contract address created, if the transaction was a contract creation, otherwise `null`.
  - `logs `:  `Array` - Array of log objects, which this transaction generated.
  - `status `:  `String` - '0x0' indicates transaction failure , '0x1' indicates transaction succeeded. 
 ##### Example
```js
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
     }, ...],
  "status": "0x1"
}
```
 ***
 #### web3.eth.getTransactionCount
     web3.eth.getTransactionCount(addressHexString [, defaultBlock] [, callback])
 Get the numbers of transactions sent from this address.
 ##### Parameters
 1. `String` - The address to get the numbers of transactions from.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.eth.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Number` - The number of transactions sent from the given address.
 ##### Example
 ```js
var number = web3.eth.getTransactionCount("0x407d73d8a49eeb85d32cf465507dd71d507100c1");
console.log(number); // 1
```
 ***
 #### web3.eth.sendTransaction
     web3.eth.sendTransaction(transactionObject [, callback])
 Sends a transaction to the network.
 ##### Parameters
 1. `Object` - The transaction object to send:
  - `from`: `String` - The address for the sending account. Uses the [web3.eth.defaultAccount](#web3ethdefaultaccount) property, if not specified.
  - `to`: `String` - (optional) The destination address of the message, left undefined for a contract-creation transaction.
  - `value`: `Number|String|BigNumber` - (optional) The value transferred for the transaction in Wei, also the endowment if it's a contract-creation transaction.
  - `gas`: `Number|String|BigNumber` - (optional, default: To-Be-Determined) The amount of gas to use for the transaction (unused gas is refunded).
  - `gasPrice`: `Number|String|BigNumber` - (optional, default: To-Be-Determined) The price of gas for this transaction in wei, defaults to the mean network gas price.
  - `data`: `String` - (optional) Either a [byte string](https://github.com/ethereum/wiki/wiki/Solidity,-Docs-and-ABI) containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
  - `nonce`: `Number`  - (optional) Integer of a nonce. This allows to overwrite your own pending transactions that use the same nonce.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The 32 Bytes transaction hash as HEX string.
 If the transaction was a contract creation use [web3.eth.getTransactionReceipt()](#web3ethgettransactionreceipt) to get the contract address, after the transaction was mined.
 ##### Example
 ```js
 // compiled solidity source code using https://chriseth.github.io/cpp-ethereum/
var code = "603d80600c6000396000f3007c01000000000000000000000000000000000000000000000000000000006000350463c6888fa18114602d57005b6007600435028060005260206000f3";
 web3.eth.sendTransaction({data: code}, function(err, transactionHash) {
  if (!err)
    console.log(transactionHash); // "0x7f9fade1c0d57a7af66ab4ead7c2eb7b11a91385"
});
```
 ***
 #### web3.eth.sendRawTransaction
     web3.eth.sendRawTransaction(signedTransactionData [, callback])
 Sends an already signed transaction. For example can be signed using: https://github.com/SilentCicero/ethereumjs-accounts
 ##### Parameters
 1. `String` - Signed transaction data in HEX format
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The 32 Bytes transaction hash as HEX string.
 If the transaction was a contract creation use [web3.eth.getTransactionReceipt()](#web3ethgettransactionreceipt) to get the contract address, after the transaction was mined.
 ##### Example
 ```js
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
//f889808609184e72a00082271094000000000000000000000000000000000000000080a47f74657374320000000000000000000000000000000000000000000000000000006000571ca08a8bbf888cfa37bbf0bb965423625641fc956967b81d12e23709cead01446075a01ce999b56a8a88504be365442ea61239198e23d1fce7d00fcfc5cd3b44b7215f
 web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
  if (!err)
    console.log(hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
});
```
 ***
 #### web3.eth.sign
     web3.eth.sign(address, dataToSign, [, callback])
 Signs data from a specific account. This account needs to be unlocked.
 ##### Parameters
 1. `String` - Address to sign with.
2. `String` - Data to sign.
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The signed data.
 After the hex prefix, characters correspond to ECDSA values like this:
```
r = signature[0:64]
s = signature[64:128]
v = signature[128:130]
```
 Note that if you are using `ecrecover`, `v` will be either `"00"` or `"01"`. As a result, in order to use this value, you will have to parse it to an integer and then add `27`. This will result in either a `27` or a `28`.
 ##### Example
 ```js
var result = web3.eth.sign("0x135a7de83802408321b74c322f8558db1679ac20",
    "0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49"); // second argument is web3.sha3("xyz")
console.log(result); // "0x30755ed65396facf86c53e6217c52b4daebe72aa4941d89635409de4c9c7f9466d4e9aaec7977f05e923889b33c0d0dd27d7226b6e6f56ce737465c5cfd04be400"
```
 ***
 #### web3.eth.call
     web3.eth.call(callObject [, defaultBlock] [, callback])
 Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.
 ##### Parameters
 1. `Object` - A transaction object see [web3.eth.sendTransaction](#web3ethsendtransaction), with the difference that for calls the `from` property is optional as well.
2. `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.eth.defaultBlock](#web3ethdefaultblock).
3. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The returned data of the call, e.g. a codes functions return value.
 ##### Example
 ```js
var result = web3.eth.call({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"
```
 ***
 #### web3.eth.estimateGas
     web3.eth.estimateGas(callObject [, callback])
 Executes a message call or transaction, which is directly executed in the VM of the node, but never mined into the blockchain and returns the amount of the gas used.
 ##### Parameters
 See [web3.eth.sendTransaction](#web3ethsendtransaction), except that all properties are optional.
 ##### Returns
 `Number` - the used gas for the simulated call/transaction.
 ##### Example
 ```js
var result = web3.eth.estimateGas({
    to: "0xc4abd0339eb8d57087278718986382264244252f", 
    data: "0xc6888fa10000000000000000000000000000000000000000000000000000000000000003"
});
console.log(result); // "0x0000000000000000000000000000000000000000000000000000000000000015"
```
 ***
 #### web3.eth.filter
 ```js
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
```
 ##### Parameters
 1. `String|Object` - The string `"latest"` or `"pending"` to watch for changes in the latest block or pending transactions respectively. Or a filter options object as follows:
  * `fromBlock`: `Number|String` - The number of the earliest block (`latest` may be given to mean the most recent and `pending` currently mining, block). By default `latest`.
  * `toBlock`: `Number|String` - The number of the latest block (`latest` may be given to mean the most recent and `pending` currently mining, block). By default `latest`.
  * `address`: `String` - An address ~or a list of addresses~ to only get logs from particular account(s).
  * `topics`: `Array of Strings` - An array of values which must each appear in the log entries. The order is important, if you want to leave topics out use `null`, e.g. `[null, '0x00...']`. You can also pass another array for each topic with options for that topic e.g. `[null, ['option1', 'option2']]`
 ##### Returns
 `Object` - A filter object with the following methods:
   * `filter.get(callback)`: Returns all of the log entries that fit the filter.
  * `filter.watch(callback)`: Watches for state changes that fit the filter and calls the callback. See [this note](#using-callbacks) for details.
  * `filter.stopWatching()`: Stops the watch and uninstalls the filter in the node. Should always be called once it is done.
 ##### Watch callback return value
 - `String` - When using the `"latest"` parameter, it returns the block hash of the last incoming block.
- `String` - When using the `"pending"` parameter, it returns a transaction hash of the most recent pending transaction.
- `Object` - When using manual filter options, it returns a log object as follows:
    - `logIndex`: `Number` - integer of the log index position in the block. `null` when its pending log.
    - `transactionIndex`: `Number` - integer of the transactions index position log was created from. `null` when its pending log.
    - `transactionHash`: `String`, 32 Bytes - hash of the transactions this log was created from. `null` when its pending log.
    - `blockHash`: `String`, 32 Bytes - hash of the block where this log was in. `null` when its pending. `null` when its pending log.
    - `blockNumber`: `Number` - the block number where this log was in. `null` when its pending. `null` when its pending log.
    - `address`: `String`, 32 Bytes - address from which this log originated.
    - `data`: `String` - contains one or more 32 Bytes non-indexed arguments of the log.
    - `topics`: `Array of Strings` - Array of 0 to 4 32 Bytes `DATA` of indexed log arguments. (In *solidity*: The first topic is the *hash* of the signature of the event (e.g. `Deposit(address,bytes32,uint256)`), except if you declared the event with the `anonymous` specifier.)
    - `type`: `STRING` - `pending` when the log is pending. `mined` if log is already mined.
 **Note** For event filter return values see [Contract Events](#contract-events)
 ##### Example
 ```js
var filter = web3.eth.filter({toBlock:'pending'});
 filter.watch(function (error, log) {
  console.log(log); //  {"address":"0x0000000000000000000000000000000000000000", "data":"0x0000000000000000000000000000000000000000000000000000000000000000", ...}
});
 // get all past logs again.
var myResults = filter.get(function(error, logs){ ... });
 ...
 // stops and uninstalls the filter
filter.stopWatching();
 ```
 ***
 #### web3.eth.contract
     web3.eth.contract(abiArray)
 Creates a contract object for a solidity contract, which can be used to initiate contracts on an address.
You can read more about events [here](https://github.com/ethereum/wiki/wiki/Ethereum-Contract-ABI#example-javascript-usage).
 ##### Parameters
 1. `Array` - ABI array with descriptions of functions and events of the contract.
 ##### Returns
 `Object` - A contract object, which can be initiated as follows:
 ```js
var MyContract = web3.eth.contract(abiArray);
 // instantiate by address
var contractInstance = MyContract.at(address);
 // deploy new contract
var contractInstance = MyContract.new([constructorParam1] [, constructorParam2], {data: '0x12345...', from: myAccount, gas: 1000000});
 // Get the data to deploy the contract manually
var contractData = MyContract.new.getData([constructorParam1] [, constructorParam2], {data: '0x12345...'});
// contractData = '0x12345643213456000000000023434234'
```
 And then you can either initiate an existing contract on an address,
or deploy the contract using the compiled byte code:
 ```js
// Instantiate from an existing address:
var myContractInstance = MyContract.at(myContractAddress);
 // Or deploy a new contract:
 // Deploy the contract asynchronous from Solidity file:
...
const fs = require("fs");
const solc = require('solc')
 let source = fs.readFileSync('nameContract.sol', 'utf8');
let compiledContract = solc.compile(source, 1);
let abi = compiledContract.contracts['nameContract'].interface;
let bytecode = compiledContract.contracts['nameContract'].bytecode;
let gasEstimate = web3.eth.estimateGas({data: bytecode});
let MyContract = web3.eth.contract(JSON.parse(abi));
 var myContractReturned = MyContract.new(param1, param2, {
   from:mySenderAddress,
   data:bytecode,
   gas:gasEstimate}, function(err, myContract){
    if(!err) {
       // NOTE: The callback will fire twice!
       // Once the contract has the transactionHash property set and once its deployed on an address.
        // e.g. check tx hash on the first call (transaction send)
       if(!myContract.address) {
           console.log(myContract.transactionHash) // The hash of the transaction, which deploys the contract
       
       // check address on the second call (contract deployed)
       } else {
           console.log(myContract.address) // the contract address
       }
        // Note that the returned "myContractReturned" === "myContract",
       // so the returned "myContractReturned" object will also get the address set.
    }
  });
 // Deploy contract syncronous: The address will be added as soon as the contract is mined.
// Additionally you can watch the transaction by using the "transactionHash" property
var myContractInstance = MyContract.new(param1, param2, {data: bytecode, gas: 300000, from: mySenderAddress});
myContractInstance.transactionHash // The hash of the transaction, which created the contract
myContractInstance.address // undefined at start, but will be auto-filled later
```
 ##### Example
 ```js
// contract abi
var abi = [{
     name: 'myConstantMethod',
     type: 'function',
     constant: true,
     inputs: [{ name: 'a', type: 'string' }],
     outputs: [{name: 'd', type: 'string' }]
}, {
     name: 'myStateChangingMethod',
     type: 'function',
     constant: false,
     inputs: [{ name: 'a', type: 'string' }, { name: 'b', type: 'int' }],
     outputs: []
}, {
     name: 'myEvent',
     type: 'event',
     inputs: [{name: 'a', type: 'int', indexed: true},{name: 'b', type: 'bool', indexed: false}]
}];
 // creation of contract object
var MyContract = web3.eth.contract(abi);
 // initiate contract for an address
var myContractInstance = MyContract.at('0xc4abd0339eb8d57087278718986382264244252f');
 // call constant function
var result = myContractInstance.myConstantMethod('myParam');
console.log(result) // '0x25434534534'
 // send a transaction to a function
myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000});
 // short hand style
web3.eth.contract(abi).at(address).myAwesomeMethod(...);
 // create filter
var filter = myContractInstance.myEvent({a: 5}, function (error, result) {
  if (!error)
    console.log(result);
    /*
    {
        address: '0x8718986382264244252fc4abd0339eb8d5708727',
        topics: "0x12345678901234567890123456789012", "0x0000000000000000000000000000000000000000000000000000000000000005",
        data: "0x0000000000000000000000000000000000000000000000000000000000000001",
        ...
    }
    */
});
```
 ***
 #### Contract Methods
 ```js
// Automatically determines the use of call or sendTransaction based on the method type
myContractInstance.myMethod(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
 // Explicitly calling this method
myContractInstance.myMethod.call(param1 [, param2, ...] [, transactionObject] [, defaultBlock] [, callback]);
 // Explicitly sending a transaction to this method
myContractInstance.myMethod.sendTransaction(param1 [, param2, ...] [, transactionObject] [, callback]);
 // Get the call data, so you can call the contract through some other means
// var myCallData = myContractInstance.myMethod.request(param1 [, param2, ...]);
var myCallData = myContractInstance.myMethod.getData(param1 [, param2, ...]);
// myCallData = '0x45ff3ff6000000000004545345345345..'
```
 The contract object exposes the contract's methods, which can be called using parameters and a transaction object.
 ##### Parameters
 - `String|Number|BigNumber` - (optional) Zero or more parameters of the function. If passing in a string, it must be formatted as a hex number, e.g. "0xdeadbeef" If you have already created BigNumber object, then you can just pass it too.
- `Object` - (optional) The (previous) last parameter can be a transaction object, see [web3.eth.sendTransaction](#web3ethsendtransaction) parameter 1 for more. **Note**: `data` and `to` properties will not be taken into account.
- `Number|String` - (optional) If you pass this parameter it will not use the default block set with [web3.eth.defaultBlock](#web3ethdefaultblock).
- `Function` - (optional) If you pass a callback as the last parameter the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - If its a call the result data, if its a send transaction a created contract address, or the transaction hash, see [web3.eth.sendTransaction](#web3ethsendtransaction) for details.
 ##### Example
 ```js
// creation of contract object
var MyContract = web3.eth.contract(abi);
 // initiate contract for an address
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 var result = myContractInstance.myConstantMethod('myParam');
console.log(result) // '0x25434534534'
 myContractInstance.myStateChangingMethod('someParam1', 23, {value: 200, gas: 2000}, function(err, result){ ... });
```
 ***
 #### Contract Events
 ```js
var event = myContractInstance.myEvent({valueA: 23} [, additionalFilterObject])
 // watch for changes
event.watch(function(error, result){
  if (!error)
    console.log(result);
});
 // Or pass a callback to start watching immediately
var event = myContractInstance.myEvent([{valueA: 23}] [, additionalFilterObject] , function(error, result){
  if (!error)
    console.log(result);
});
 ```
 You can use events like [filters](#web3ethfilter) and they have the same methods, but you pass different objects to create the event filter.
 ##### Parameters
 1. `Object` - Indexed return values you want to filter the logs by, e.g. `{'valueA': 1, 'valueB': [myFirstAddress, mySecondAddress]}`. By default all filter values are set to `null`. It means, that they will match any event of given type sent from this contract.
2. `Object` - Additional filter options, see [filters](#web3ethfilter) parameter 1 for more. By default filterObject has field 'address' set to address of the contract. Also first topic is the signature of event.
3. `Function` - (optional) If you pass a callback as the last parameter it will immediately start watching and you don't need to call `myEvent.watch(function(){})`. See [this note](#using-callbacks) for details.
 ##### Callback return
 `Object` - An event object as follows:
 - `address`: `String`, 32 Bytes - address from which this log originated.
- `args`: `Object` - The arguments coming from the event.
- `blockHash`: `String`, 32 Bytes - hash of the block where this log was in. `null` when its pending.
- `blockNumber`: `Number` - the block number where this log was in. `null` when its pending.
- `logIndex`: `Number` - integer of the log index position in the block.
- `event`: `String` - The event name.
- `removed`: `bool` -  indicate if the transaction this event was created from was removed from the blockchain (due to orphaned block) or never get to it (due to rejected transaction).
- `transactionIndex`: `Number` - integer of the transactions index position log was created from.
- `transactionHash`: `String`, 32 Bytes - hash of the transactions this log was created from.
 ##### Example
 ```js
var MyContract = web3.eth.contract(abi);
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 // watch for an event with {some: 'args'}
var myEvent = myContractInstance.myEvent({some: 'args'}, {fromBlock: 0, toBlock: 'latest'});
myEvent.watch(function(error, result){
   ...
});
 // would get all past logs again.
var myResults = myEvent.get(function(error, logs){ ... });
 ...
 // would stop and uninstall the filter
myEvent.stopWatching();
```
 ***
 #### Contract allEvents
 ```js
var events = myContractInstance.allEvents([additionalFilterObject]);
 // watch for changes
events.watch(function(error, event){
  if (!error)
    console.log(event);
});
 // Or pass a callback to start watching immediately
var events = myContractInstance.allEvents([additionalFilterObject], function(error, log){
  if (!error)
    console.log(log);
});
 ```
 Will call the callback for all events which are created by this contract.
 ##### Parameters
 1. `Object` - Additional filter options, see [filters](#web3ethfilter) parameter 1 for more. By default filterObject has field 'address' set to address of the contract. This method sets the topic to the signature of event, and does not support additional topics.
2. `Function` - (optional) If you pass a callback as the last parameter it will immediately start watching and you don't need to call `myEvent.watch(function(){})`. See [this note](#using-callbacks) for details.
 ##### Callback return
 `Object` - See [Contract Events](#contract-events) for more.
 ##### Example
 ```js
var MyContract = web3.eth.contract(abi);
var myContractInstance = MyContract.at('0x78e97bcc5b5dd9ed228fed7a4887c0d7287344a9');
 // watch for an event with {some: 'args'}
var events = myContractInstance.allEvents({fromBlock: 0, toBlock: 'latest'});
events.watch(function(error, result){
   ...
});
 // would get all past logs again.
events.get(function(error, logs){ ... });
 ...
 // would stop and uninstall the filter
events.stopWatching();
```
 ****
 #### web3.eth.getCompilers
## Compiling features being deprecated https://github.com/ethereum/EIPs/issues/209
    web3.eth.getCompilers([callback])
 Gets a list of available compilers.
 ##### Parameters
 1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Array` - An array of strings of available compilers.
 ##### Example
 ```js
var number = web3.eth.getCompilers();
console.log(number); // ["lll", "solidity", "serpent"]
```
 ***
 #### web3.eth.compile.solidity
     web3.eth.compile.solidity(sourceString [, callback])
 Compiles solidity source code.
 ##### Parameters
 1. `String` - The solidity source code.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Object` - Contract and compiler info.
 ##### Example
 ```js
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
```
 ***
 #### web3.eth.compile.lll
     web3.eth.compile.lll(sourceString [, callback])
 Compiles LLL source code.
 ##### Parameters
 1. `String` - The LLL source code.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The compiled LLL code as HEX string.
 ##### Example
 ```js
var source = "...";
 var code = web3.eth.compile.lll(source);
console.log(code); // "0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056"
```
 ***
 #### web3.eth.compile.serpent
     web3.eth.compile.serpent(sourceString [, callback])
 Compiles serpent source code.
 ##### Parameters
 1. `String` - The serpent source code.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - The compiled serpent code as HEX string.
 ```js
var source = "...";
 var code = web3.eth.compile.serpent(source);
console.log(code); // "0x603880600c6000396000f3006001600060e060020a600035048063c6888fa114601857005b6021600435602b565b8060005260206000f35b600081600702905091905056"
```
 ***
 #### web3.eth.namereg
     web3.eth.namereg
 Returns GlobalRegistrar object.
 ##### Usage
 see [namereg](https://github.com/ethereum/web3.js/blob/master/example/namereg.html) example.
 ***
 ### web3.db
 #### web3.db.putString
     web3.db.putString(db, key, value)
 This method should be called, when we want to store a string in the local leveldb database.
 ##### Parameters
 1. `String` - The database to store to.
2. `String` - The name of the store.
3. `String` - The string value to store.
 ##### Returns
 `Boolean` - `true` if successfull, otherwise `false`.
 ##### Example
  param is db name, second is the key, and third is the string value.
```js
web3.db.putString('testDB', 'key', 'myString') // true
```
 ***
 #### web3.db.getString
     web3.db.getString(db, key)
 This method should be called, when we want to get string from the local leveldb database.
 ##### Parameters
 1. `String` - The database string name to retrieve from.
2. `String` - The name of the store.
 ##### Returns
 `String` - The stored value.
 ##### Example
 param is db name and second is the key of string value.
```js
var value = web3.db.getString('testDB', 'key');
console.log(value); // "myString"
```
 ***
 #### web3.db.putHex
     web3.db.putHex(db, key, value)
 This method should be called, when we want to store binary data in HEX form in the local leveldb database.
 ##### Parameters
 1. `String` - The database to store to.
2. `String` - The name of the store.
3. `String` - The HEX string to store.
 ##### Returns
 `Boolean` - `true` if successfull, otherwise `false`.
 ##### Example
```js
web3.db.putHex('testDB', 'key', '0x4f554b443'); // true
 ```
 ***
 #### web3.db.getHex
     web3.db.getHex(db, key)
 This method should be called, when we want to get a binary data in HEX form from the local leveldb database.
 ##### Parameters
 1. `String` - The database to store to.
2. `String` - The name of the store.
 ##### Returns
 `String` - The stored HEX value.
 ##### Example
 param is db name and second is the key of value.
```js
var value = web3.db.getHex('testDB', 'key');
console.log(value); // "0x4f554b443"
```
 ***
 ### web3.shh
 [Whisper  Overview](https://github.com/ethereum/wiki/wiki/Whisper-Overview)
 ##### Example
 ```js
var shh = web3.shh;
```
 ***
 #### web3.shh.post
    web3.shh.post(object [, callback])
 This method should be called, when we want to post whisper message to the network.
 ##### Parameters
 1. `Object` - The post object:
  - `from`: `String`, 60 Bytes HEX - (optional) The identity of the sender.
  - `to`: `String`, 60 Bytes  HEX - (optional) The identity of the receiver. When present whisper will encrypt the message so that only the receiver can decrypt it.
  - `topics`: `Array of Strings` - Array of topics `Strings`, for the receiver to identify messages.
  - `payload`: `String|Number|Object` - The payload of the message. Will be autoconverted to a HEX string before.
  - `priority`: `Number` - The integer of the priority in a range from ... (?).
  - `ttl`: `Number` - integer of the time to live in seconds.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Boolean` - returns `true` if the message was sent, otherwise `false`.
 ##### Example
 ```js
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
```
 ***
 #### web3.shh.newIdentity
     web3.shh.newIdentity([callback])
 Should be called to create new identity.
 ##### Parameters
 1. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `String` - A new identity HEX string.
 ##### Example
 ```js
var identity = web3.shh.newIdentity();
console.log(identity); // "0xc931d93e97ab07fe42d923478ba2465f283f440fd6cabea4dd7a2c807108f651b7135d1d6ca9007d5b68aa497e4619ac10aa3b27726e1863c1fd9b570d99bbaf"
```
 ***
 #### web3.shh.hasIdentity
     web3.shh.hasIdentity(identity, [callback])
 Should be called, if we want to check if user has given identity.
 ##### Parameters
 1. `String` - The identity to check.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Returns
 `Boolean` - returns `true` if the identity exists, otherwise `false`.
 ##### Example
 ```js
var identity = web3.shh.newIdentity();
var result = web3.shh.hasIdentity(identity);
console.log(result); // true
 var result2 = web3.shh.hasIdentity(identity + "0");
console.log(result2); // false
```
 ***
 #### web3.shh.newGroup
 ##### Example
```js
// TODO: not implemented yet
```
 ***
 #### web3.shh.addToGroup
 ##### Example
```js
// TODO: not implemented yet
```
 ***
 #### web3.shh.filter
 ```js
var filter = web3.shh.filter(options)
 // watch for changes
filter.watch(function(error, result){
  if (!error)
    console.log(result);
});
```
 Watch for incoming whisper messages.
 ##### Parameters
 1. `Object` - The filter options:
  * `topics`: `Array of Strings` - Filters messages by this topic(s). You can use the following combinations:
    - `['topic1', 'topic2'] == 'topic1' && 'topic2'`
    - `['topic1', ['topic2', 'topic3']] == 'topic1' && ('topic2' || 'topic3')`
    - `[null, 'topic1', 'topic2'] == ANYTHING && 'topic1' && 'topic2'` -> `null` works as a wildcard
  * `to`: Filter by identity of receiver of the message. If provided and the node has this identity, it will decrypt incoming encrypted messages.
2. `Function` - (optional) If you pass a callback the HTTP request is made asynchronous. See [this note](#using-callbacks) for details.
 ##### Callback return
 `Object` - The incoming message:
   - `from`: `String`, 60 Bytes - The sender of the message, if a sender was specified.
  - `to`: `String`, 60 Bytes - The receiver of the message, if a receiver was specified.
  - `expiry`: `Number` - Integer of the time in seconds when this message should expire (?).
  - `ttl`: `Number` -  Integer of the time the message should float in the system in seconds (?).
  - `sent`: `Number` -  Integer of the unix timestamp when the message was sent.
  - `topics`: `Array of String` - Array of `String` topics the message contained.
  - `payload`: `String` - The payload of the message.
  - `workProved`: `Number` - Integer of the work this message required before it was send (?).
 ***
 #### web3.eth.sendIBANTransaction
 ```js
var txHash = web3.eth.sendIBANTransaction('0x00c5496aee77c1ba1f0854206a26dda82a81d6d8', 'XE81ETHXREGGAVOFYORK', 0x100);
```
 Sends IBAN transaction from user account to destination IBAN address.
 ##### Parameters
 - `string` - address from which we want to send transaction
- `string` - IBAN address to which we want to send transaction
- `value` - value that we want to send in IBAN transaction
 ***
 #### web3.eth.iban
 ```js
var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
```
 ***
 #### web3.eth.iban.fromAddress
 ```js
var i = web3.eth.iban.fromAddress('0x00c5496aee77c1ba1f0854206a26dda82a81d6d8');
console.log(i.toString()); // 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS
```
 ***
 #### web3.eth.iban.fromBban
 ```js
var i = web3.eth.iban.fromBban('ETHXREGGAVOFYORK');
console.log(i.toString()); // "XE81ETHXREGGAVOFYORK"
```
 ***
 #### web3.eth.iban.createIndirect
 ```js
var i = web3.eth.iban.createIndirect({
  institution: "XREG",
  identifier: "GAVOFYORK"
});
console.log(i.toString()); // "XE81ETHXREGGAVOFYORK"
```
 ***
 #### web3.eth.iban.isValid
 ```js
var valid = web3.eth.iban.isValid("XE81ETHXREGGAVOFYORK");
console.log(valid); // true
 var valid2 = web3.eth.iban.isValid("XE82ETHXREGGAVOFYORK");
console.log(valid2); // false, cause checksum is incorrect
 var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var valid3 = i.isValid();
console.log(valid3); // true
 ```
 ***
 #### web3.eth.iban.isDirect
 ```js
var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var direct = i.isDirect();
console.log(direct); // false
```
 ***
 #### web3.eth.iban.isIndirect
 ```js
var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var indirect = i.isIndirect();
console.log(indirect); // true
```
 ***
 #### web3.eth.iban.checksum
 ```js
var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var checksum = i.checksum();
console.log(checksum); // "81"
```
 ***
 #### web3.eth.iban.institution
 ```js
var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var institution = i.institution();
console.log(institution); // 'XREG'
```
 ***
 #### web3.eth.iban.client
 ```js
var i = new web3.eth.iban("XE81ETHXREGGAVOFYORK");
var client = i.client();
console.log(client); // 'GAVOFYORK'
```
 ***
 #### web3.eth.iban.address
 ```js
var i = new web3.eth.iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
var address = i.address();
console.log(address); // '00c5496aee77c1ba1f0854206a26dda82a81d6d8'
```
 ***
 #### web3.eth.iban.toString
 ```js
var i = new web3.eth.iban('XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS');
console.log(i.toString()); // 'XE7338O073KYGTWWZN0F2WZ0R8PX5ZPPZS'
```