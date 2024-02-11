// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../EthericCrystals/EthericCrystals.sol";
import "../EthericEnergy/EthericEnergy.sol";
import "../EthericEssence/EthericEssence.sol";
import "../Items/Items.sol";

/// @custom:security-contact krlebyte@gmail.com
contract Game is Ownable {
  enum Rarity {COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC}

  event RandomItem (address indexed player, uint256 id);

  mapping(Rarity => uint256) public craftPrice;
  mapping(Rarity => uint256) public disenchantReward;
  mapping(Rarity => uint256[]) private _chestItems;
  mapping(uint256 => Rarity) private _itemRarity;

  uint256 private constant POW = 10 ** 18;
  uint256 public immutable deployTimestamp;
  uint256 public craftEcrPrice = 100 * POW;

  EthericEssence public eesToken;
  EthericCrystals public ecrToken;
  EthericEnergy public escrToken;
  Items public items;

  constructor (address initialOwner) Ownable (initialOwner) {
    craftPrice[Rarity.UNCOMMON] = 100 * POW;
    craftPrice[Rarity.RARE] = 400 * POW;
    craftPrice[Rarity.EPIC] = 1600 * POW;
    craftPrice[Rarity.LEGENDARY] = 6400 * POW;
    craftPrice[Rarity.MYTHIC] = 25600 * POW;

    disenchantReward[Rarity.UNCOMMON] = 10 * POW;
    disenchantReward[Rarity.RARE] = 40 * POW;
    disenchantReward[Rarity.EPIC] = 160 * POW;
    disenchantReward[Rarity.LEGENDARY] = 640 * POW;
    disenchantReward[Rarity.MYTHIC] = 2560 * POW;

    deployTimestamp = block.timestamp;
  }

  function setContracts (
    address eesAddress,
    address ecrAddress,
    address enrgAddress,
    address itemsAddress
  ) external onlyOwner {
    eesToken = EthericEssence(eesAddress);
    ecrToken = EthericCrystals(ecrAddress);
    escrToken = EthericEnergy(enrgAddress);
    items = Items(itemsAddress);
  }

  // ---------- S T A K I N G ----------

  function energize (uint256 ecrAmount) external {
    require(ecrAmount > 0, "Must be greater than 0.");

    uint256 enrgValue = _enrgValue();
    uint256 enrgAmount = ecrAmount * POW / enrgValue;

    ecrToken.burnFrom(msg.sender, ecrAmount);
    escrToken.mint(msg.sender, enrgAmount);
  }

  function solidify (uint256 enrgAmount) external {
    require(enrgAmount > 0, "Must be greater than 0.");

    uint256 escrValue = _enrgValue();
    uint256 ecrAmount = (enrgAmount * escrValue) / POW;

    escrToken.burnFrom(msg.sender, enrgAmount);
    ecrToken.mint(msg.sender, ecrAmount);
  }

  // ---------- ITEMS ----------

  function unlockChest () external {
    uint256 rarityRng = _randomNumber(1000); // 0-999
    Rarity rarity;

    if (rarityRng < 800) { // 0-799
      rarity = Rarity.UNCOMMON;
    } else if (rarityRng >= 800 && rarityRng < 950) { // 800-949
      rarity = Rarity.RARE;
    } else if (rarityRng >= 951 && rarityRng < 980) { // 950-979
      rarity = Rarity.EPIC;
    } else if (rarityRng >= 981 && rarityRng < 999) { // 981-998
      rarity = Rarity.LEGENDARY;
    } else { // 999
      rarity = Rarity.MYTHIC;
    }

    uint256[] memory chestItemsRarity = _chestItems[rarity];

    require(chestItemsRarity.length > 0, "No items in the list yet.");

    uint256 skinRng = _randomNumber(chestItemsRarity.length);
    uint256 itemId = chestItemsRarity[skinRng];

    emit RandomItem(msg.sender, itemId);

    items.burn(msg.sender, 1, 1);
    items.mint(msg.sender, itemId, 1, "");
  }

  function craftItem (uint256 id, uint256 amount) external {
    uint256 priceEcr = craftEcrPrice * amount;
    uint256 priceEes;

    if (id == 1) {
      priceEes = craftPrice[Rarity.UNCOMMON] * amount;
    } else {
      priceEes = craftPrice[_itemRarity[id]] * amount;
    }

    ecrToken.burnFrom(msg.sender, priceEcr);
    eesToken.burnFrom(msg.sender, priceEes);
    items.mint(msg.sender, id, amount, "");
  }

  function disenchantItem (uint256 id, uint256 amount) external {
    require(id != 1, "Chests cannot be disenchanted");

    uint256 reward = disenchantReward[_itemRarity[id]] * amount;

    eesToken.mint(msg.sender, reward);
    items.burn(msg.sender, id, amount);
  }

  // ---------- A D M I N ----------

  function addItem (uint256 id, Rarity rarity) external onlyOwner {
    // if (id < 1000 || id > 19999) {
    //   revert IdInvalid();
    // }

    _itemRarity[id] = rarity;
    _chestItems[rarity].push(id);
  }

  function claimRewards (
    address player,
    uint256 eesAmount,
    uint256 ecrAmount
  ) external onlyOwner {
    eesToken.mint(player, eesAmount);
    ecrToken.mint(player, ecrAmount);
  }

  // ---------- P R I V A T E ----------

  function _enrgValue () private view returns (uint256 value) {
    uint256 baseValue = 1 * POW;
    uint256 rewardPerSecond = 1000000;
    value = baseValue + ((block.timestamp - deployTimestamp) * rewardPerSecond);
  }

  function _randomNumber (uint256 range) private view returns (uint256 value) {
    value = uint256(
      keccak256(abi.encode(block.timestamp, block.difficulty, msg.sender))
    ) % range;
  }
}
