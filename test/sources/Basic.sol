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

    function requireWithoutReason() public {
        require(false);
    }

    function requireWithReason() public {
        require(false, 'REVERTED WITH REQUIRE');
    }

    function reverts() public {
        revert('REVERTED WITH REVERT');
    }

    function firesEvent(address addr, uint val) public {
        emit BasicEvent(addr, val);
    }

}
