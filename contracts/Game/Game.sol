// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../EthericCrystals/EthericCrystals.sol";
import "../EthericEnergy/EthericEnergy.sol";
import "../EthericEssence/EthericEssence.sol";
import "../Items/Items.sol";

/// @custom:security-contact krlebyte@gmail.com
contract Game {
  enum Rarity {COMMON, UNCOMMON, RARE, EPIC, LEGENDARY, MYTHIC}

  event Energize (uint256 ecrAmount, uint256 enrgAmount);
  event Solidify (uint256 ecrAmount, uint256 enrgAmount);
  event UnlockChest (address indexed player, uint256 id);
  event CraftItem (uint256 totalEes, uint256 totalEcr, uint256 id, uint256 amount);
  event DisenchantItem (uint256 totalEes, uint256 id, uint256 amount);

  struct CraftPrice {
    uint256 ees;
    uint256 ecr;
  }

  mapping(Rarity => CraftPrice) public craftPrice;
  mapping(Rarity => uint256) public disenchantReward;
  mapping(Rarity => uint256[]) private _chestItems;
  mapping(uint256 => Rarity) private _itemRarity;

  uint256 private constant POW = 10 ** 18;
  uint256 private constant CHEST_ID = 1;
  address private immutable _adminAddress;
  uint256 public immutable deployTimestamp;

  CraftPrice public craftChestPrice = CraftPrice(100 * POW, 100 * POW);

  EthericEssence public immutable eesToken;
  EthericCrystals public immutable ecrToken;
  EthericEnergy public immutable enrgToken;
  Items public immutable items;

  constructor (address adminAddress) {
    eesToken = new EthericEssence(address(this));
    ecrToken = new EthericCrystals(address(this));
    enrgToken = new EthericEnergy(address(this));
    items = new Items(address(this));

    craftPrice[Rarity.UNCOMMON] = CraftPrice(200 * POW, 200 * POW);
    craftPrice[Rarity.RARE] = CraftPrice(800 * POW, 400 * POW);
    craftPrice[Rarity.EPIC] = CraftPrice(3200 * POW, 600 * POW);
    craftPrice[Rarity.LEGENDARY] = CraftPrice(12800 * POW, 800 * POW);
    craftPrice[Rarity.MYTHIC] = CraftPrice(51200 * POW, 1000 * POW);

    disenchantReward[Rarity.UNCOMMON] = 20 * POW;
    disenchantReward[Rarity.RARE] = 80 * POW;
    disenchantReward[Rarity.EPIC] = 320 * POW;
    disenchantReward[Rarity.LEGENDARY] = 1280 * POW;
    disenchantReward[Rarity.MYTHIC] = 5120 * POW;

    _adminAddress = adminAddress;
    deployTimestamp = block.timestamp;
  }

  modifier onlyAdmin {
    require(_adminAddress == msg.sender, "Only admin can call.");_;
  }

  // ---------- S T A K I N G ----------

  function energize (uint256 ecrAmount) external {
    require(ecrAmount > 0, "Must be greater than 0.");

    uint256 enrgValue = _enrgValue();
    uint256 enrgAmount = ecrAmount * POW / enrgValue;

    ecrToken.burnFrom(msg.sender, ecrAmount);
    enrgToken.mint(msg.sender, enrgAmount);

    emit Energize(ecrAmount, enrgAmount);
  }

  function solidify (uint256 enrgAmount) external {
    require(enrgAmount > 0, "Must be greater than 0.");

    uint256 enrgValue = _enrgValue();
    uint256 ecrAmount = (enrgAmount * enrgValue) / POW;

    enrgToken.burnFrom(msg.sender, enrgAmount);
    ecrToken.mint(msg.sender, ecrAmount);

    emit Solidify(ecrAmount, enrgAmount);
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
    uint256 amount = 1;
    bytes memory data = "";

    items.burn(msg.sender, CHEST_ID, amount);
    items.mint(msg.sender, itemId, amount, data);

    emit UnlockChest(msg.sender, itemId);
  }

  function craftItem (uint256 id, uint256 amount) external {
    CraftPrice memory price;

    if (id == CHEST_ID) {
      price = craftChestPrice;
    } else {
      price = craftPrice[_itemRarity[id]];
    }

    require(price.ees > 0 && price.ecr > 0, "Invalid item.");

    uint256 totalEes = price.ees * amount;
    uint256 totalEcr = price.ecr * amount;
    bytes memory data = "";

    eesToken.burnFrom(msg.sender, totalEes);
    ecrToken.burnFrom(msg.sender, totalEcr);
    items.mint(msg.sender, id, amount, data);

    emit CraftItem(totalEes, totalEcr, id, amount);
  }

  function disenchantItem (uint256 id, uint256 amount) external {
    require(id != CHEST_ID, "Chests cannot be disenchanted.");

    uint256 reward = disenchantReward[_itemRarity[id]];
    uint256 totalEes = reward * amount;

    eesToken.mint(msg.sender, totalEes);
    items.burn(msg.sender, id, amount);

    emit DisenchantItem(totalEes, id, amount);
  }

  // ---------- A D M I N ----------

  function addItem (uint256 id, Rarity rarity) external onlyAdmin {
    require(id != CHEST_ID, "Chests cannot be added to the chest.");
    _itemRarity[id] = rarity;
    _chestItems[rarity].push(id);
  }

  function claimRewards (
    address player,
    uint256 eesAmount,
    uint256 ecrAmount
  ) external onlyAdmin {
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
