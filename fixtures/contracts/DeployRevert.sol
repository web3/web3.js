// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

contract DeployRevert {
	constructor() public {
		require(false);
	}
}
