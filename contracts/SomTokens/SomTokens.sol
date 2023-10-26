// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";

/// @custom:security-contact krlebyte@gmail.com
contract SomTokens is ERC1155, ERC1155Burnable, ERC1155Supply, Ownable {
  address public gameAddress;

  mapping(uint256 => string) private _tokenUri;

  constructor () ERC1155("") {}

  function mint (
    address account,
    uint256 id,
    uint256 amount,
    bytes memory data
  ) public {
    require(gameAddress != address(0), "Game address not set.");
    require(msg.sender == gameAddress, "Only game contract can mint.");
    _mint(account, id, amount, data);
  }

  function mintBatch (
    address to,
    uint256[] memory ids,
    uint256[] memory amounts,
    bytes memory data
  ) public {
    require(gameAddress != address(0), "Game address not set.");
    require(msg.sender == gameAddress, "Only game contract can mint.");
    _mintBatch(to, ids, amounts, data);
  }

  function burn (address account, uint256 id, uint256 value) public override {
    require(msg.sender == gameAddress, "Only game contract can burn.");
    super.burn(account, id, value);
  }

  function burnBatch (
    address account,
    uint256[] memory ids,
    uint256[] memory values
  ) public override {
    require(msg.sender == gameAddress, "Only game contract can burn.");
    super.burnBatch(account, ids, values);
  }

  function uri (uint256 id) override public view returns (string memory) {
    return _tokenUri[id];
  }

  function setTokenUri (uint256 id, string memory tokenUri) public onlyOwner {
    _tokenUri[id] = tokenUri;
  }

  function setGameAddress (address account) public onlyOwner {
    require(gameAddress == address(0), "Game address is already set.");
    gameAddress = account;
  }

  function _beforeTokenTransfer (
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
