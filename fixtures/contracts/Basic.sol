// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

contract Basic {
	uint256 intValue;
	string stringValue;
	bool boolValue;

	event StringEvent(string str);
	event MultiValueEvent(string str, uint256 val, bool flag);
	event MultiValueIndexedEvent(string str, uint256 indexed val, bool indexed flag);

	constructor(uint256 _val, string memory _stringValue) {
		intValue = _val;
		stringValue = _stringValue;
	}

	function getStringValue() public view returns (string memory) {
		return stringValue;
	}

	function getIntValue() public view returns (uint256) {
		return intValue;
	}

	function getBoolValue() public view returns (bool) {
		return boolValue;
	}

	function getValues()
		public
		view
		returns (
			uint256,
			string memory,
			bool
		)
	{
		return (intValue, stringValue, boolValue);
	}

	function setValues(
		uint256 _value,
		string memory _stringValue,
		bool _boolValue
	) public {
		intValue = _value;
		stringValue = _stringValue;
		boolValue = _boolValue;
	}

	function requireWithoutReason() public pure {
		require(false);
	}

	function requireWithReason() public pure {
		require(false, 'REVERTED WITH REQUIRE');
	}

	function reverts() public pure {
		revert('REVERTED WITH REVERT');
	}

	function firesMultiValueEvent(
		string memory str,
		uint256 val,
		bool flag
	) public {
		emit MultiValueEvent(str, val, flag);
	}

	function firesMultiValueIndexedEvent(
		string memory str,
		uint256 val,
		bool flag
	) public {
		emit MultiValueIndexedEvent(str, val, flag);
	}

	function firesStringEvent(string memory _str) public {
		emit StringEvent(_str);
	}
}
