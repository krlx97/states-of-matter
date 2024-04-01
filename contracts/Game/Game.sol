// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../Collectibles/Collectibles.sol";
import "../EthericCrystals/EthericCrystals.sol";
import "../EthericEnergy/EthericEnergy.sol";

/// @custom:security-contact krlebyte@gmail.com
contract Game is Ownable {
  enum Rarity {COMMON, UNCOMMON, RARE, EPIC, LEGENDARY}

  error InsufficientAmount ();
  error ItemListEmpty ();

  event Energize (uint256 ecrAmount, uint256 enrgAmount);
  event Solidify (uint256 ecrAmount, uint256 enrgAmount);
  event OpenShardPack (address indexed player, uint256[] ids);
  event CraftItem (uint256 totalEes, uint256 id, uint256 amount);
  event TradeupItems (uint256 id);

  mapping(Rarity => uint256) private _shardsRequired;
  mapping(Rarity => uint256[]) private _chestItems;
  mapping(uint256 => Rarity) private _itemRarity;

  uint256 private constant DECIMALS = 10 ** 18;
  uint256 private constant SHARD_PACK_ID = 1;
  uint256 public immutable deployTimestamp;
  uint256 public craftPrice = 100 * DECIMALS;

  Collectibles public immutable collectibles;
  EthericCrystals public immutable ecrToken;
  EthericEnergy public immutable enrgToken;

  constructor (address initialOwner) Ownable(initialOwner) {
    collectibles = new Collectibles(address(this));
    ecrToken = new EthericCrystals(address(this));
    enrgToken = new EthericEnergy(address(this));

    _shardsRequired[Rarity.UNCOMMON] = 1;
    _shardsRequired[Rarity.RARE] = 10;
    _shardsRequired[Rarity.EPIC] = 100;
    _shardsRequired[Rarity.LEGENDARY] = 1000;

    deployTimestamp = block.timestamp;
  }

  // ---------- S T A K I N G ----------

  function energize (uint256 ecrAmount) external {
    if (ecrAmount < 1) {
      revert InsufficientAmount();
    }

    uint256 enrgValue = _enrgValue();
    uint256 enrgAmount = ecrAmount * DECIMALS / enrgValue;

    ecrToken.burnFrom(msg.sender, ecrAmount);
    enrgToken.mint(msg.sender, enrgAmount);

    emit Energize(ecrAmount, enrgAmount);
  }

  function solidify (uint256 enrgAmount) external {
    if (enrgAmount < 1) {
      revert InsufficientAmount();
    }

    uint256 enrgValue = _enrgValue();
    uint256 ecrAmount = enrgAmount * enrgValue / DECIMALS;

    enrgToken.burnFrom(msg.sender, enrgAmount);
    ecrToken.mint(msg.sender, ecrAmount);

    emit Solidify(ecrAmount, enrgAmount);
  }

  // ---------- ITEMS ----------

  function openShardPack () external {
    uint256[] memory ids = new uint256[](4);
    uint256[] memory amounts = new uint256[](4);

    for (uint256 i = 0; i < 4; i += 1) {
      Rarity rarity = Rarity(i + 1);

      if (_chestItems[rarity].length < 1) {
        revert ItemListEmpty();
      }

      uint256 id = _randomNumber(_chestItems[rarity].length);
      uint256 shardId = _getShardId(_chestItems[rarity][id]);

      ids[i] = shardId;
      amounts[i] = 1;
    }

    collectibles.burn(msg.sender, SHARD_PACK_ID, 1);
    collectibles.mintBatch(msg.sender, ids, amounts, "");

    emit OpenShardPack(msg.sender, ids);
  }

  function craftItem (uint256 id, uint256 amount) external {
    uint256 shardId = _getShardId(id);
    uint256 shardsRequired = _shardsRequired[_itemRarity[id]] * amount;
    uint256 totalPrice = craftPrice * amount;

    ecrToken.burnFrom(msg.sender, totalPrice);
    collectibles.burn(msg.sender, shardId, shardsRequired);
    collectibles.mint(msg.sender, id, amount, "");

    emit CraftItem(craftPrice, id, amount);
  }

  function tradeupItems (uint256[] memory ids, uint256[] memory amounts) external {
    require(ids.length == amounts.length, "Arrays length mismatch.");

    Rarity _rarity;
    uint256 totalAmount;

    for (uint256 i = 0; i < ids.length; i += 1) {
      if (i == 0) {
        _rarity = _itemRarity[ids[i]];
      } else {
        require(_itemRarity[ids[i]] == _rarity, "Rarities must be same.");
      }

      require(amounts[i] > 0, "Must trade up positive amount.");
      totalAmount += amounts[i];
    }

    require(totalAmount == 10, "Must trade up exactly 10 items.");
    require(_rarity != Rarity.LEGENDARY, "Cannot trade up legendary items.");

    Rarity nextRarity;

    if (_rarity == Rarity.UNCOMMON) {
      nextRarity = Rarity.RARE;
    } else if (_rarity == Rarity.RARE) {
      nextRarity = Rarity.EPIC;
    } else if (_rarity == Rarity.EPIC) {
      nextRarity = Rarity.LEGENDARY;
    }

    uint256 id = _chestItems[nextRarity][_randomNumber(_chestItems[nextRarity].length)];

    ecrToken.burnFrom(msg.sender, craftPrice);
    collectibles.burnBatch(msg.sender, ids, amounts);
    collectibles.mint(msg.sender, id, 1, "");

    emit TradeupItems(id);
  }

  // ---------- A D M I N ----------

  function addItems (
    uint256[] memory ids,
    Rarity[] memory rarities
  ) external onlyOwner {
    require(ids.length == rarities.length, "Lists need to be the same length");

    for (uint256 i = 0; i < ids.length; i += 1) {
      uint256 id = ids[i];
      Rarity rarity = rarities[i];

      _itemRarity[id] = rarity;
      _chestItems[rarity].push(id);
    }
  }

  function claimRewards (
    address player,
    uint256 ecrAmount,
    uint256 shardPackAmount
  ) external onlyOwner {
    if (ecrAmount > 0) {
      ecrToken.mint(player, ecrAmount);
    }

    if (shardPackAmount > 0) {
      collectibles.mint(player, SHARD_PACK_ID, shardPackAmount, "");
    }
  }

  function updateCraftPrice () external onlyOwner {
    uint256 ecrSupply = ecrToken.totalSupply();
    craftPrice = ecrSupply / 100000;
  }

  // ---------- P R I V A T E ----------

  function _getShardId (uint256 skinId) private pure returns (uint256 value) {
    value = skinId * 10;
  }

  function _enrgValue () private view returns (uint256 value) {
    uint256 baseValue = 1 * DECIMALS;
    uint256 rewardPerSecond = 1000000000;
    value = baseValue + ((block.timestamp - deployTimestamp) * rewardPerSecond);
  }

  function _randomNumber (uint256 range) private view returns (uint256 value) {
    value = uint256(
      keccak256(abi.encode(block.timestamp, block.difficulty, msg.sender))
    ) % range;
  }
}
