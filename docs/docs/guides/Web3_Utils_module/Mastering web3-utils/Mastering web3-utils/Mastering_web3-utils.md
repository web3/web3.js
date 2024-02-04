# Mastering web3.js Utils

## Introduction

## Imports

There are three different way to import utils package.

1. The first way to import untils package is to import the module 
Const [ Web3 ] = require("web3"); 
then inialiazing a provider with const web3 = new Web3("");
To be able to access the package we need to type Web3.utils.toWei()


2. Now the second way to do is just import the utils package from the web3
Const { toWei } = require("web3-utils");
Then we are also able to use any function like utils.toWei()

3. The third way to do is to just import a specific function, then we'll be able to use it here
Const { toWei } = require("web3-utils");
toWei();


## Random Bytes

There are two way to generate Random Bytes.

1. The first function that is knownn as Randon Bytes, it receives a parameter of the size of bytes you want to generate and it will return the bytes in an array format.
-> Array format
Console.log(utils.randomBytes());

2. The second function is known as Randon Hex also requires a parameter of the size of bytes and it will return the btytes in Hexadecimal format
-> Hex format
console.log(utils.randomHex());

If you don't give any arguments then both of these functions will have a default value as 32.

## Conversions - Ethereum Denominations

We've got two different functions to perform conversions between ethereum denominations.

1. toWei(any) -> wei 
For example, if we want to convert 1 ether to wei we can use the function below
console.log(utils.toWei("1", "ether"));
And to convert gwei to wei, we can do the following below.
console.log(utils.toWei("1", "gwei"));

2. fromWei(wei) -> any
To use the second function, we can convert 10^18(1000000000000000000) wei to ether, to get its output we can follow the below given methid.
console.log(utils.FromWEi("1000000000000000000", "ether"));
We can follow the same method to convert 1000000000000000000 to gwei, which is given below.
console.log("utils.fromWei("1000000000000000000", "gwei"));

When we run the console, it will show us the results.


## Conversions to Hex Values









