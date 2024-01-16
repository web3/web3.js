---

sidebar_position: 6

sidebar_label: 'Hardhat Integration Guide'

---

# Web3.js-Hardhat

 

# Introduction

 

Hardhat is a development environment for Ethereum software. Its a complete development environment that consists of different components for editing, compiling, debugging and deploying smart Contracts and Daaps.

 

This Docs Contains a step-by-step process on "How to integrate web3-js with Hardhat"

 

## Installation

 

To install hardhat in a project you need to create an npm project by going to an empty folder and run `npm init` or you can use a different package manager such as yarn.

 

To install hardhat in your project using node run the following command:

 

```

    npm install --save-dev hardhat

```

 

For yarn based package

 

```

   yarn add --dev hardhat

```

 

## Using Hardhat Locally

 

For using local installation of hardhat, run the following command:

 

```

    npx hardhat init

```

 

Select `Create a Javascript Project` and then continue till hardhat adds all the required dependencies.

Now lets learn how to deploy a contract using `Hardhat`
 - You should find a contract named `Lock.Sol` in the contracts folder

```
 // SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        emit Withdrawal(address(this).balance, block.timestamp);

        owner.transfer(address(this).balance);
    }
}

```

- Now let's look at the Javascript File named `deploy.js` from the folder `scripts` and use web3.js to deploy the contract onto the `Blockchain`  using `Hardhat`
