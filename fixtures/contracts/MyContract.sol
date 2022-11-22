// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

contract MyContract {
	string private myAttribute;

	function getAttr() public view returns (string memory) {
		return myAttribute;
	}
}
