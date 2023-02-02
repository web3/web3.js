/*
This file is part of web3.js.

web3.js is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

web3.js is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/

pragma solidity ^0.8.7;

contract SampleStorageContract {
	uint256 uintNum;

	event NEWNUM(uint256 param);

	function storeNum(uint256 param) public {
		uintNum = param;
		emit NEWNUM(param);
	}

	function retrieveNum() public view returns (uint256) {
		return uintNum;
	}
}
