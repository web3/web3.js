// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

contract DeployRevert {
    constructor() {
        require(false);
    }
}
