// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @custom:security-contact krlebyte@gmail.com
contract EthericEssence is ERC20, ERC20Burnable {
  address private immutable _gameAddress;

  constructor (address gameAddress)
  ERC20("Etheric Essence", "EES") {
    _gameAddress = gameAddress;
  }

  modifier onlyGame {
    require(msg.sender == _gameAddress, "Only game contract can call.");_;
  }

  function transfer (
    address to,
    uint256 value
  ) public override(ERC20) pure returns (bool) {
    return true;
  }

  function transferFrom (
    address from,
    address to,
    uint256 value
  ) public override(ERC20) pure returns (bool) {
    return true;
  }

  function mint (address to, uint256 amount) public onlyGame {
    _mint(to, amount);
  }

  function burn (uint256 value) public override(ERC20Burnable) {}

  function burnFrom (
    address account,
    uint256 value
  ) public override(ERC20Burnable) onlyGame {
    _spendAllowance(account, msg.sender, value);
    _burn(account, value);
  }
}
