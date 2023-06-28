// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

contract NegativeNumbers {
	int256 public storedNegativeNumber;

	event OneNegativeNumber(int256 one);
	event OneNegativeNumberIndexed(int256 indexed one);
	event TwoNegativeNumbers(int256 one, int256 two);
	event TwoNegativeNumbersIndexed(int256 indexed one, int256 indexed two);
	event OtherNegativeNumbers(uint256 positive, int256 negative, string str);
	event OtherNegativeNumbersIndexed(
		uint256 indexed positive,
		int256 indexed negative,
		string str
	);

	constructor(int256 number) {
		storedNegativeNumber = number;
	}

	function oneNegativeNumber(int256 number) public {
		emit OneNegativeNumber(number);
		emit OneNegativeNumberIndexed(number);
	}

	function twoNegativeNumbers(int256 number, int256 number2) public {
		emit TwoNegativeNumbers(number, number2);
		emit TwoNegativeNumbersIndexed(number, number2);
	}

	function otherNegativeNumbers(
		int256 number,
		int256 number2,
		string calldata str
	) public {
		emit OtherNegativeNumbers(uint256(number), number2, str);
		emit OtherNegativeNumbersIndexed(uint256(number), number2, str);
	}
}
