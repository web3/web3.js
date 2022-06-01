// SPDX-License-Identifier: GNU

pragma solidity ^0.8.13;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract ERC721Token is ERC721URIStorage {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenIds;

	constructor() ERC721('GameItem', 'ITM') {}

	function awardItem(address player, string memory tokenURI) public returns (uint256) {
		uint256 newItemId = _tokenIds.current();
		_mint(player, newItemId);
		_setTokenURI(newItemId, tokenURI);

		_tokenIds.increment();
		return newItemId;
	}
}
