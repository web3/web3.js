/**
 * Source contract for Basic.json
 */
pragma solidity ^0.5.1;

contract Basic {

    uint value;
    event BasicEvent(address addr, uint indexed val);
    event StringEvent(string str);
    event IndexedStringEvent(string str);

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

    function firesStringEvent(string memory _str) public {
        emit StringEvent(_str);
    }

    function firesIndexedStringEvent(string memory _str) public {
        emit IndexedStringEvent(_str);
    }

    function firesIllegalUtf8StringEvent() public {
        emit StringEvent('�������');
    }
}
