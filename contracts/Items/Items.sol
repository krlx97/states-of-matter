// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

// import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @custom:security-contact krlebyte@gmail.com
contract Items is ERC1155, ERC1155Burnable, ERC1155Supply {
  address public gameAddress;

  modifier onlyGame {
    require(gameAddress != address(0), "Game address not set.");
    require(gameAddress == msg.sender, "Only game contract can call.");
    _;
  }

  constructor(address game) ERC1155("") {
    gameAddress = game;
  }

  function mint (
    address account,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public onlyGame {
    _mint(account, id, amount, data);
  }

  function mintBatch (
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public onlyGame {
    _mintBatch(to, ids, amounts, data);
  }

  function _beforeTokenTransfer(
    address operator,
    address from,
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) internal override(ERC1155, ERC1155Supply) {
    super._beforeTokenTransfer(operator, from, to, ids, amounts, data);
  }

  // function _update (
  //   address from,
  //   address to,
  //   uint256[] memory ids,
  //   uint256[] memory values
  // ) internal override(ERC1155, ERC1155Supply) {
  //   super._update(from, to, ids, values);
  // }
}
