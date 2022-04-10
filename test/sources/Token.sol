//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

interface Gateway {
  function getSignedBalance(address addr) external view returns(uint256 balance, bytes memory sig);
}

error OffchainLookup(address sender, string[] urls, bytes callData, bytes4 callbackFunction, bytes extraData);


/**
 * @title Token
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 * Based on https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/examples/SimpleToken.sol
 */
contract Token is ERC20, Ownable {
  using ECDSA for bytes32;

  string[] public urls;
  address private _signer;
  mapping(address=>bool) claimed;

  /**
    * @dev Constructor that gives msg.sender all of existing tokens.
    */
  constructor(
      string memory name,
      string memory symbol,
      uint256 initialSupply
  ) ERC20(name, symbol) {
    _mint(msg.sender, initialSupply);
  }

  function setUrls(string[] memory urls_) external onlyOwner{
    urls = urls_;
  }

  function setSigner(address signer_) external onlyOwner{
    _signer = signer_;
  }

  function getSigner() external view returns(address){
    return _signer;
  }

  function balanceOf(address addr) public override view returns(uint balance) {
    if(claimed[addr]){
      return super.balanceOf(addr);
    } else {
    revert OffchainLookup(
        address(this),
        urls,
        abi.encodeWithSelector(Gateway.getSignedBalance.selector, addr),
        Token.balanceOfWithSig.selector,
        abi.encode(addr)
      );
    }
  }

  function transfer(address recipient, uint256 amount) public override returns (bool) {
    if(claimed[msg.sender]){
      _transfer(msg.sender, recipient, amount);
    } else {
      revert OffchainLookup(
        address(this),
        urls,
        abi.encodeWithSelector(Gateway.getSignedBalance.selector, msg.sender),
        Token.transferWithSig.selector,
        abi.encode(recipient, amount)
      );
    }
    return true;
  }

    function balanceOfWithSig(bytes calldata result, bytes calldata extraData) external view returns(uint) {
        if(result.length < 0) {

        }
        revert OffchainLookup(
            address(this),
            urls,
            abi.encodeWithSelector(Gateway.getSignedBalance.selector, msg.sender),
            Token.balanceOfWithSigTwo.selector,
            extraData
        );
    }

  function balanceOfWithSigTwo(bytes calldata result, bytes calldata extraData) external view returns(uint) {
    (address addr) = abi.decode(extraData, (address));

    uint balance = super.balanceOf(addr);
    return balance + _getBalance(addr, result);
  }

  function transferWithSig(bytes calldata result, bytes calldata extraData) external returns(bool) {
    (address recipient, uint256 amount) = abi.decode(extraData, (address, uint256));
    uint offchainBalance = _getBalance(msg.sender, result);
    if(offchainBalance > 0) {
      claimed[msg.sender] = true;
      _mint(msg.sender, offchainBalance);
    }
    _transfer(msg.sender, recipient, amount);
    return true;
  }

  function _getBalance(address addr, bytes memory result) public view returns(uint) {
    (uint256 balance, bytes memory sig) = abi.decode(result, (uint256, bytes));
    if(claimed[addr]) {
      return 0;
    } else {
      address recovered = keccak256(
        abi.encodePacked("\x19Ethereum Signed Message:\n32",
        keccak256(abi.encodePacked(balance, addr))
      )).recover(sig);

      require(_signer == recovered, "Signer is not the signer of the token");
      return balance;
    }
  }
}
