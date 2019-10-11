/**
 * Source contract for Basic.json
 */
pragma solidity ^0.5.1;

contract Basic {

    uint value;

    function getValue() public view returns (uint value) {
        return value;
    }

    function setValue(uint _value) public {
        value = _value;
    }

    function reverts() public {
        require(false);
    }

}
