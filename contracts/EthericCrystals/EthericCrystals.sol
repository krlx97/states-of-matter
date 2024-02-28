// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

/// @custom:security-contact krlebyte@gmail.com
contract EthericCrystals is ERC20, ERC20Burnable {
  address private immutable _gameAddress;

  constructor (address gameAddress) ERC20 ("Etheric Crystals", "ECR") {
    _gameAddress = gameAddress;
  }

  modifier onlyGame {
    require(msg.sender == _gameAddress, "Only game contract can call.");_;
  }

  function mint (address to, uint256 amount) public onlyGame {
    _mint(to, amount);
  }

  function burn (uint256 amount) public override(ERC20Burnable) onlyGame {
    _burn(msg.sender, amount);
  }

  function burnFrom (
    address account,
    uint256 amount
  ) public override(ERC20Burnable) onlyGame {
    _spendAllowance(account, msg.sender, amount);
    _burn(account, amount);
  }
}
