pragma solidity ^0.4.24;

contract simpleContract{
    mapping(address => string) public data;
    function addData(string value){
        data[msg.sender] = value;
    }    
}