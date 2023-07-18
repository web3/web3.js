pragma solidity 0.8.19;

contract SimpleOverload {
	uint256 public secret;
	string public someString;

	constructor() {
		secret = 42;
	}

	function getSecret() public view returns (uint256) {
		return secret;
	}

	function getSecret(uint256 numToAdd) public view returns (uint256) {
		return secret + numToAdd;
	}

	function getSecret(uint256 numToAdd, string calldata _someString)
		public
		view
		returns (uint256, string memory)
	{
		return (secret + numToAdd, string.concat(someString, _someString));
	}

	function setSecret() public {
		secret = 42;
	}

	function setSecret(uint256 numToAdd) public {
		secret += numToAdd;
	}

	function setSecret(uint256 numToAdd, string calldata _someString) public {
		secret += numToAdd;
		someString = _someString;
	}

	function multicall(bytes[] calldata datas) external {
		for (uint256 i = 0; i < datas.length; i++) {
			address(this).call(datas[i]);
		}
	}

	function multicall(uint256 deadline, bytes[] calldata datas) external {
		require(block.timestamp <= deadline);
		for (uint256 i = 0; i < datas.length; i++) {
			address(this).call(datas[i]);
		}
	}
}
