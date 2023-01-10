// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

error Unauthorized();
error CustomError(string);

contract ErrorsContract {
	address payable owner = payable(0x0);

	constructor() {}

	function unauthorize() public {
		if (msg.sender != owner) revert Unauthorized();

		owner.transfer(address(this).balance);
	}

	function badRequire() public {
		if (1 < 2) revert CustomError('reverted using custom Error');

		owner.transfer(address(this).balance);
	}
}
