// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @custom:security-contact krlebyte@gmail.com
contract Items is ERC1155, ERC1155Burnable, ERC1155Supply {
  address private immutable _gameAddress;

  constructor (address gameAddress) ERC1155("https://som.eternitas.games/json") {
    _gameAddress = gameAddress;
  }

  modifier onlyGame {
    require(msg.sender == _gameAddress, "Only game contract can call.");_;
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
}
