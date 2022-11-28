// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

error Unauthorized();

contract ErrorsContract {
	address payable owner = payable(0x0);

	constructor() {}

	function unauthorize() public {
		if (msg.sender != owner) revert Unauthorized();

		owner.transfer(address(this).balance);
	}
}
