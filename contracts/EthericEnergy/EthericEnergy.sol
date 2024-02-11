// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";

/// @custom:security-contact krlebyte@gmail.com
contract EthericEnergy is ERC20, ERC20Burnable {
  address public gameAddress;

  modifier onlyGame {
    require(msg.sender == gameAddress);
    _;
  }

  constructor (address game) ERC20("Etheric Energy", "ENRG") {
    gameAddress = game;
  }

  function mint (address to, uint256 amount) public onlyGame {
    _mint(to, amount);
  }

  // function burn (uint256 value) public override(ERC20Burnable) onlyGame {}
  // function burnFrom (address account, uint256 value) public override(ERC20Burnable) onlyGame {}
}
