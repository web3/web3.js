/**
 * Source contract for Basic.json
 */
pragma solidity ^0.5.1;

contract Basic {

    uint value;
    event BasicEvent(address addr, uint indexed val);

    function getValue() public view returns (uint val) {
        return value;
    }

    function setValue(uint _value) public {
        value = _value;
    }

    function reverts() public {
        require(false);
    }

    function firesEvent(address addr, uint val) public {
        emit BasicEvent(addr, val);
    }

}
