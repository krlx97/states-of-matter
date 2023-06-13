// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

/// @custom:security-contact krlebyte@gmail.com
contract SomCurrency is ERC20, ERC20Burnable, ERC20Capped, Ownable {
  address public gameAddress;

  constructor ()
    ERC20("Void Matter", "VMT")
    ERC20Capped(100000000 * (10 ** 18)) {}

  function mint (address account, uint256 amount) public {
    require(gameAddress != address(0), "Game address not set.");
    require(msg.sender == gameAddress, "Only game contract can mint.");
    _mint(account, amount);
  }

  function burn (uint256 amount) public override {
    require(msg.sender == gameAddress, "Only game contract can burn.");
    super.burn(amount);
  }

  function burnFrom (address account, uint256 amount) public override {
    require(msg.sender == gameAddress, "Only game contract can burn.");
    super.burnFrom(account, amount);
  }

  function setGameAddress (address account) public onlyOwner {
    require(gameAddress == address(0), "Game address is already set.");
    gameAddress = account;
  }

  function _mint (
    address account,
    uint256 amount
  ) internal override(ERC20, ERC20Capped) {
    super._mint(account, amount);
  }
}
