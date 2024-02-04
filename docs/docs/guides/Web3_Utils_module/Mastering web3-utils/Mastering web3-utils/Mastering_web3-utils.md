# Mastering web3.js Utils

## Introduction

## Imports

There are three different way to import utils package.

1. The first way to import untils package is to import the module 
`Const [ Web3 ] = require("web3"); `
then inialiazing a provider with `const web3 = new Web3("");`
To be able to access the package we need to type `Web3.utils.toWei()`


2. Now the second way to do is just import the utils package from the web3
`Const { toWei } = require("web3-utils");`
Then we are also able to use any function like `utils.toWei()`

3. The third way to do is to just import a specific function, then we'll be able to use it here
`Const { toWei } = require("web3-utils");`
`toWei();`


## Random Bytes

There are two way to generate Random Bytes.

1. The first function that is knownn as Randon Bytes, it receives a parameter of the size of bytes you want to generate and it will return the bytes in an array format.
array format
`Console.log(utils.randomBytes());`

2. The second function is known as Randon Hex also requires a parameter of the size of bytes and it will return the btytes in Hexadecimal format
Hex format
`console.log(utils.randomHex());`

If you don't give any arguments then both of these functions will have a default value as 32.

## Conversions - Ethereum Denominations

We've got two different functions to perform conversions between ethereum denominations.

1. `toWei(any) -> wei `
For example, if we want to convert 1 ether to wei we can use the function below
`console.log(utils.toWei("1", "ether"));`
And to convert gwei to wei, we can do the following below.
`console.log(utils.toWei("1", "gwei"));`

2. `fromWei(wei) -> any`
To use the second function, we can convert 10^18(1000000000000000000) wei to ether, to get its output we can follow the below given methid.
`console.log(utils.FromWEi("1000000000000000000", "ether"));`
We can follow the same method to convert 1000000000000000000 to gwei, which is given below.
`console.log("utils.fromWei("1000000000000000000", "gwei"));`

When we run the console, it will show us the results.


## Conversions to Hex Values

There are many ways to convert any value into Hexadecimal but one of the most simplest and easiest is to use the function to Hex 
`toHex(any) > Hex`
which will accept anry parameter and will always return a Hexadecimal value so this function can accept numbers "big Int", "strings", "booleans" and "objects". Below is how you can write them.

`console.log(utils.toHex(10)); // numbers`
`console.log(utils.toHex(10n)); // big numbers`
`console.log(utils.toHex("10")); // strings`
Strings are returned after being decoded in ASCI value, then it gets converted into a Hexadecimal.
`console.log(utils.toHex(false)); // booleans`
`console.log(utils.toHex({ vehicle: "car" })); // objects`

Other Alternatives
`console.log(utils.numberToHex(10));`  // number -> Hex
`console.log(utils.numberToHex(10)); ` // number -> Hex
`console.log(utils.numberToHex("text"));`  // number -> Hex
`console.log(utils.numberToHex("text"));`  // number -> Hex

bytes (array) -> Hex
Another case is if you want to convert bytes in an arrayed format
Here is how you can do it.
`const arr = [72,12]`
`console.log(utils.toHex(arr));` // Uint8arry
`console.log(utils.bytesToHex(arr));` // bytes

## Conversions UTF and ASCII

We can convert Hexadecimal values to UTF and ASCII values. UTF has a broader range of characters and can support emojis as well, hence it is recommended to use. If we use UTF and send Emoji as a Hexadecimal value, it will return the emoji but the same case cannot be applied when it comes ASCII values.

## Conversions - Numbers and Bigint

There are three different ways to convert Hexadecimal values into numbers.

1.This function `toNumber` returns Hexadecimal value in number format
`console.log(utils.toNumber("0xa"));` // Hex -> number

2.This function `hexToNumberString` will convert Hexadecimal value into anumber and returns it in string format
`console.log(utils.hexToNumberString("0xa"));` // Hex -> string(number)

3.This function will `toBigInt` returns the number in a big int format
`console.log(utils.toBigInt("0xa"));` // hex -> bigint

## Hashing Functions

There are two main functions that we can use for Hashing.
First function is `Sha3`  it will always receive a string as a parameter and it will return the Hash in a Hexadecimal value.
`console.log(utils.sha3("web3"));`

Second function is `SoliditySha3` can receive a string a uint address or bytes as a parameter and it will return the Hash in a Hexadecimal value.
`console.log(utils.soliditySha3({ type: "string", value: "web3" }));`

## Addresses

If we want to see if an address is valid, before we were able to use `isAddress()` function we can do that by following the below function.
`console.log(utils.toChecksumAddress("0xa3286..............."));`
By running this function, we can check and see if the provided address in the function is valid, if we pass the address with wrong case characters, then this function will checksum perform and return with the correct address characters.

## Packing and Padding

