// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

contract MsgSender {
	string public testString;

	constructor(string memory _testString) {
		testString = _testString;
	}

	function from() public view returns (address) {
		return msg.sender;
	}

	function setTestString(string memory _testString) public returns (bool, string memory) {
		testString = _testString;
		return (true, testString);
	}
}
