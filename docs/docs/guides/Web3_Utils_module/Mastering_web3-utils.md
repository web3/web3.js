# Mastering web3.js Utils

## Introduction
In this tutorial, we'll learn about the different functionalities of the web3 utils package, it contains the methods to know how to generate random bytes in different formats, how to perform conversion between Hex values in strings and numbers, hashing functions, addresses, packing padding and in the last part we'll look at how to compare block numbers.

## Imports

There are three different ways to import utils package.

1.Import the entire web3 module and initialize a provider:

```bash
const [ Web3 ] = require("web3"); 
```
then initializing  a provider with 
```bash
const web3 = new Web3("");
```
To be able to access the package you need to type

```bash 
web3.utils.toWei()
```


2.Import only the utils package from web3:
```bash 
const { utils } = require("web3"); 
```
```bash
import { Web3 } from 'web3';
```
```bash
import * as utils from 'web3-utils';
```
    Then you are also able to use any function like
    `utils.toWei()`

3.Import a specific function from the utils package: 
```bash
const { toWei } = require("web3-utils");
```    
    then you'll be able to use it here `toWei();`


## Random Bytes

There are two ways to generate Random Bytes.

1.The first function that is known as Random Bytes, it receives a parameter of the size of bytes you want to generate and it will return the bytes in an array format.
    array format 
```bash
console.log(utils.randomBytes());
```
2.The second function is known as Random Hex also requires a parameter of the size of bytes and it will return the bytes in Hexadecimal format
    Hex format 
```bash    
console.log(utils.randomHex());
```
    If you don't give any arguments then both of these functions will have a default value as 32.


## Conversions - Ethereum Denominations

We've got two different functions to perform conversions between Ethereum denominations.

a.`toWei(any) -> wei `  
For example, if we want to convert 1 ether to wei we can use the function below
```bash
console.log(utils.toWei("1", "ether"));
```
And to convert gwei to wei, we can do the following.  
```bash
console.log(utils.toWei("1", "gwei"));
```

b.`fromWei(wei) -> any`  
To use the second function, you can convert 10^18(1000000000000000000) wei to ether, to get its output you can follow the below given methid.
```bash
console.log(utils.FromWei("1000000000000000000", "ether"));
```
You can follow the same method to convert 1000000000000000000 to gwei, which is given below.
`console.log("utils.fromWei("1000000000000000000", "gwei"));`  
When you run the console, it will show us the results.


## Conversions to Hex Values

There are many ways to convert any value into Hexadecimal but one of the simplest and easiest is to use the function to Hex 
`toHex(any) > Hex` which will accept anry parameter and will always return a Hexadecimal value so this function can accept numbers "big Int", "strings", "booleans" and "objects". Below is how you can write them.

For Numbers: 
`console.log(utils.toHex(10));`

For Big Numbers:
`console.log(utils.toHex(10n));` 

For Strings: 
`console.log(utils.toHex("10"));` 

Strings are returned after being decoded in ASCII value, then it gets converted into a Hexadecimal.

For Booleans: 
`console.log(utils.toHex(false));`  

For Objects:
`console.log(utils.toHex({ vehicle: "car" }));`

Other Alternatives:

Number -> Hex: 
`console.log(utils.numberToHex(10));`

Decimal-> Hex: 
`console.log(utils.fromDecimal(10)); ` 

String -> Hex: 
`console.log(utils.utf8ToHex("text"));` 

String -> Hex: 
`console.log(utils.asciiToHex("text"));`

bytes (array) -> Hex
Another case is if you want to convert bytes in an arrayed format
Here is how you can do it.

Array: 
`const arr = [72,12]`

Uint8Arry: 
`console.log(utils.toHex(arr));` 

Bytes: 
`console.log(utils.bytesToHex(arr));` 


## Conversions UTF and ASCII

You can convert Hexadecimal values to UTF and ASCII values. UTF has a broader range of characters and can support emojis as well, hence it is recommended to use. If you use UTF and send Emoji as a Hexadecimal value, it will return the emoji but the same case cannot be applied when it comes ASCII values.

Example function:

For Emoji to UTF:
```bash
console.log("utf:", utils.toUtf8("0xf09f988a"));`
```

For emoji to Ascii:
```bash
console.log("ascii:", utils.toAscii("0xf09f988a"));
```

## Conversions - Numbers and Bigint

There are three different ways to convert Hexadecimal values into numbers.

1. This function `toNumber` returns Hexadecimal value in number format
Hex -> number: `console.log(utils.toNumber("0xa"));`

2. This function `hexToNumberString` will convert Hexadecimal value into a number and returns it in string format
Hex -> string(number): `console.log(utils.hexToNumberString("0xa"));` 

3. This function will `toBigInt` returns the number in a big integer format
Hex -> bigInt: `console.log(utils.toBigInt("0xa"));` 


## Hashing Functions

There are two main functions that you can use for Hashing.
1. This function is `Sha3`  it will always receive a string as a parameter and it will return the Hash in a Hexadecimal value.
`console.log(utils.sha3("web3"));`

2. The other function is `SoliditySha3` can receive a string a uint address or bytes as a parameter and it will return the Hash in a Hexadecimal value. It is often used in Solidity smart contracts to generate a hash of various data types.

Example:

`console.log(utils.soliditySha3({ type: "string", value: "web3" }));`

`console.log(utils.soliditySha3("web3", 42, true));`
 

## Addresses

If you want to see if an address is valid, before you were able to use `isAddress()` function you can do that by following this function. `console.log(utils.toChecksumAddress("0xa3286..............."));` 
With the help of this function, you can check and see if the provided address in the function is valid, if you pass the address with wrong case characters, then this function will checksum perform and return with the correct address characters.

`isAddress` Function:
If you want to validate whether an Ethereum address is correctly formatted, you should use the isAddress function.
`const isValid = utils.isAddress("0xa3286...............");`
`console.log(isValid);` // true or false
The isAddress function returns true if the provided string is a valid Ethereum address and false otherwise.


## Packing and Padding

Packing: Encode packing function has the same behavious as the solidity ABI: `console.log(abi.encodePacked("Hello", "World"));`

if you packed the strings it will return a Hex value, below is the function to perform this method
`console.log(utils.encodepacked("10", "10", "10"));`

if you packed the numbers it will treat them as a `uint 256`, and it will pack them with zeros to convert them into a `byte32` number, then that will pack the different values. Below is the function to perform this method
`console.log(utils.encodepacked(10, 10, 10));`


Padding: There are two main functions that you can use for padding, `padRight()` and `padLeft()`. The first parameter the function will receive is the number that you want to pad.

Function for padRight:
`console.log(utils.padRight());`

function for padLeft:
`console.log(utils.padLeft());`


## Compare Block Numbers

To compare block numbers you can use a function that allows us to compare block numbers. If the first argument is higher than the second one then it will return `1` and if its lower then it will return `-1` and if they are equal then it returns a `0`. 

You can send strings "pending" and "latest" or block numbers as well.

Example usage:

`const Web3Utils = require('web3-utils');`

Define two block numbers or strings representing block numbers

`const blockNumber1 = 'latest';`

Equivalent to 440 in decimal: 

`const blockNumber2 = '0x1b4'; `

Compare the block numbers

`const comparisonResult = Web3Utils.compareBlockNumbers(blockNumber1, blockNumber2);`

Log the result
console.log(`Comparison result: ${comparisonResult}`);

In the above example, 'latest' represents the latest block number, while '0x1b4' represents the block number 440 in hexadecimal form. The compareBlockNumbers function will compare these two block numbers and log the result to the console.

Keep in mind that you need to have the web3.js Utils module installed in your project to use this function. You can install it using npm:

```bash
npm install web3-utils
```

