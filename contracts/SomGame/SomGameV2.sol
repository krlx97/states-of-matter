// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../SomCurrency/SomCurrency.sol";
import "../SomSkins/SomSkins.sol";

/// @custom:security-contact krlebyte@gmail.com
contract SomGame is ERC1155Holder, Ownable {
  event RandomSkin (address indexed account, uint256 id);
  event ListItem (address indexed seller, uint256 listingId, uint256 skinId, uint256 amount, uint256 price);
  event CancelItem (uint256 listingId);
  event BuyItem (uint256 listingId, uint256 amount);

  error NegativeAmount ();
  error InsufficientAmount ();
  error InvalidDecimals ();
  error NotVested ();
  error IdInvalid ();
  error IdNotEven ();
  error IdExists ();
  error IdDoesntExist ();

  enum Rarity {UNCOMMON, RARE, EPIC}
  enum ItemType {CHEST, SHARD, SKIN}

  struct Total {
    uint256 staked;
    uint256 unstaked;
    // uint256 liquidity;
    uint256 rewards;
    uint256 burned;
    uint16 airdrops;
  }

  struct Pool {
    uint256 toRewards;
    uint256 toBurned;
  }

  struct Player {
    uint256 staked;
    uint256 unstaked;
    uint256 vesting;
    uint256 rewards;
    uint256 liquidity;
    uint16 airdrops;
    bool isStaker;
    bool hasClaimedStarterPack;
  }

  struct Skin {
    address author;
    Rarity rarity;
  }

  struct Item {
    address seller;
    uint256 id;
    uint256 amount;
    uint256 price;
  }

  mapping(address => Player) public players;
  mapping(uint256 => mapping(Rarity => uint256[])) public chests;
  mapping(uint256 => Skin) public skins;
  mapping(uint256 => uint256) public skinShards; // returns skinId
  mapping(uint256 => Item) public items;

  mapping (Rarity => uint256) private _craftPrice;
  mapping (Rarity => uint256) private _disenchantReward;

  address private immutable _devAddress;
  uint256 private immutable _decimals;
  address[] private _stakers;
  uint256[] private _chestIds;
  uint256 private _lastItem;

  Total public total;
  Pool public pool;
  SomCurrency public somCurrency;
  SomSkins public somSkins;


  // wTLOS 0xaE85Bf723A9e74d6c663dd226996AC1b8d075AA9
  IERC20 public immutable token1;
  // ECR <address>
  IERC20 public immutable token2;

  // State variables for token reserves
  uint256 public reserve1;
  uint256 public reserve2;

  // State variables for liquidity shares
  uint256 public totalLiquidity;
  mapping(address => uint256) public userLiquidity;

  // Events
  event MintLpToken(
    address indexed _liquidityProvider,
    uint256 _sharesMinted
  );

  event BurnLpToken(
    address indexed _liquidityProvider,
    uint256 _sharesBurned
  );


  constructor (address dev, address ECR, address erc1155, address wTLOS) {
    somCurrency = SomCurrency(ECR);
    somSkins = SomSkins(erc1155);
    total.airdrops = 50000;
    _devAddress = dev;
    _decimals = somCurrency.decimals();

    _craftPrice[Rarity.UNCOMMON] = 50;
    _craftPrice[Rarity.RARE] = 500;
    _craftPrice[Rarity.EPIC] = 5000;

    _disenchantReward[Rarity.UNCOMMON] = 100;
    _disenchantReward[Rarity.RARE] = 1000;
    _disenchantReward[Rarity.EPIC] = 10000;

    token1 = IERC20(wTLOS);
    token2 = SomCurrency(ECR);
  }
  // ---------- PUBLIC ----------

  // ----- Skins -----
  function unlockChest (uint256 chestId) public payable {
    uint256 rarityRng = _rng(100); // 0-99
    Rarity rarity;

    if (rarityRng < 90) {
      rarity = Rarity.UNCOMMON;
    } else if (rarityRng >= 90 && rarityRng < 99) {
      rarity = Rarity.RARE;
    } else {
      rarity = Rarity.EPIC;
    }

    uint256[] memory skinsList = chests[chestId][rarity];

    require(skinsList.length > 0, "No skins in the list yet.");

    uint256 skinId = skinsList[_rng(skinsList.length)];
    Skin memory skin = _getSkin(skinId);

    uint256 payment = _distributePayment(skin.author, skin.rarity);

    //pool.toRewards += toRewards;
    //pool.toBurned += toBurn;
    //players[skin.author].rewards += toAuthor;

    emit RandomSkin(msg.sender, skinId);

    somCurrency.transferFrom(msg.sender, address(this), payment);
    somSkins.burn(msg.sender, chestId, 1);
    somSkins.mint(msg.sender, skinId, 1, "");
  }

  function fuseShards (uint256 shardId) public {
    uint skinId = _getSkinId(shardId);
    Skin memory skin = _getSkin(skinId);

    uint256 payment = _distributePayment(skin.author, skin.rarity);

    //pool.toRewards += toRewards;
    //pool.toBurned += toBurn;
    //players[skin.author].rewards += toAuthor;

    somCurrency.transferFrom(msg.sender, address(this), payment);
    somSkins.burn(msg.sender, shardId, 3);
    somSkins.mint(msg.sender, skinId, 1, "");
  }

  function craftShards (uint256 shardId, uint256 amount) public {
    Skin memory skin = _getSkin(_getSkinId(shardId));

    somSkins.burn(msg.sender, 0, _craftPrice[skin.rarity] * amount);
    somSkins.mint(msg.sender, shardId, amount, "");
  }

  function disenchantSkins (uint256 skinId, uint256 amount) public {
    Skin memory skin = _getSkin(skinId);

    somSkins.burn(msg.sender, skinId, amount);
    somSkins.mint(msg.sender, 0, _disenchantReward[skin.rarity] * amount, "");
  }
  // ----- Market -----
  function listItem (uint256 id, uint256 amount, uint256 price) public {
    //require(amount > 0, "Must sell at least 1.");
    if (amount < 1) { revert InsufficientAmount(); }
    require(price >= _currency(1), "Asking price should be at least 1.");

    _lastItem += 1;
    items[_lastItem] = Item(msg.sender, id, amount, price);

    emit ListItem(msg.sender, _lastItem, id, amount, price);

    somSkins.safeTransferFrom(msg.sender, address(this), id, amount, "");
  }

  function cancelItem (uint256 listingId) public {
    Item storage item = items[listingId];

    require(msg.sender == item.seller, "You are not the seller.");
    require(item.amount > 0, "Already sold out.");

    uint256 amount = item.amount;

    item.amount = 0;

    emit CancelItem(listingId);

    somSkins.safeTransferFrom(address(this), msg.sender, item.id, amount, "");
  }

  function buyItem (uint256 listingId, uint256 amount) public {
    Item storage item = items[listingId];

    //require(item.amount >= amount, "Invalid amount specified.");
    if (item.amount < amount) { revert InsufficientAmount(); }

    uint256 totalPrice = item.price * amount;
    uint256 toRewards;
    uint256 toBurn;
    uint256 toAuthor;
    address author;

    if (item.id >= 10 && item.id < 1000) { // chest
      toRewards = totalPrice / 100 * 2;
      toBurn = totalPrice / 100 * 1;
    } else if (item.id >= 1000 && item.id < 100000) { // skin / shard
      if (item.id % 2 == 0) { // skin
        author = skins[item.id].author;
      } else { // skin shard
        author = skins[item.id - 1].author; // maybe find a better way???
      }

      toRewards = totalPrice / 100 * 1;
      toBurn = totalPrice / 100 * 1;
      toAuthor = totalPrice / 100 * 1;
    }

    uint256 toSeller = totalPrice - toRewards - toBurn - toAuthor;

    item.amount -= amount;
    pool.toBurned += toBurn;
    pool.toRewards += toRewards;
    players[author].rewards += toAuthor;

    emit BuyItem(listingId, amount);

    somCurrency.transferFrom(msg.sender, address(this), totalPrice);
    somCurrency.transfer(item.seller, toSeller);
    somSkins.safeTransferFrom(address(this), msg.sender, item.id, amount, "");
  }
  // ---------- ADMIN ----------
  function addChest (uint256 chestId) public onlyOwner {
    if (chestId < 10 || chestId > 999) { revert IdInvalid(); }
    //require(chestId >= 10 && chestId < 1000, "Chest range from 10 to 999.");
    _chestIds.push(chestId);
  }

  function addSkin (address author, uint256 id, Rarity rarity) public onlyOwner {
    Skin storage skin = skins[id];

    //require(id >= 1000 && id < 100000, "Skin range from 1000 to 99999.");
    if (id < 1000 || id > 999999) { revert IdInvalid(); }
    //require(id % 2 == 0, "Skin id should be even.");
    if (id % 2 != 0) { revert IdNotEven(); }
    //require(skin.author == address(0), "Skin is already registered.");
    if (skin.author != address(0)) { revert IdExists(); }

    skin.author = author;
    skin.rarity = rarity;
    skinShards[id + 1] = id;
  }

  function addSkinToChest (uint256 skinId, uint256 chestId) public onlyOwner {
    Skin memory skin = skins[skinId];
    //require(skin.author != address(0), "Skin not registered yet.");
    if (skin.author == address(0)) { revert IdDoesntExist(); }
    chests[chestId][skin.rarity].push(skinId);
  }

  // function levelUp (address account, uint16 level) public onlyOwner {
  //   uint16 airdrops;
  //   uint256[] memory ids = new uint256[](4);
  //   uint256[] memory amounts = new uint256[](4);

  //   ids[0] = 0; //essence
  //   amounts[0] = 0;

  //   if (level % 1 == 0) {
  //     airdrops += 1;
  //     amounts[0] += 1;
  //   }

  //   if (level % 10 == 0) {
  //     airdrops += 5;
  //     amounts[0] += 10;
  //     ids[1] = _rng(_chestIds.length);
  //     amounts[1] = 1;
  //     ids[2] = chests[10][Rarity.UNCOMMON][_rng(chests[10][Rarity.UNCOMMON].length)];
  //     amounts[2] = 1;
  //   }

  //   if (level % 50 == 0) {
  //     airdrops += 10;
  //     amounts[0] += 20;
  //     ids[3] = chests[10][Rarity.RARE][_rng(chests[10][Rarity.RARE].length)];
  //     amounts[3] = 1;
  //   }

  //   if (level % 100 == 0) {
  //     airdrops += 15;
  //     amounts[0] += 100;
  //     ids[4] = chests[10][Rarity.EPIC][_rng(chests[10][Rarity.EPIC].length)];
  //     amounts[4] = 1;
  //   }

  //   _airdrop(account, airdrops);

  //   somSkins.mintBatch(account, ids, amounts, "");
  // }
  // ---------- PRIVATE ----------
  function _currency (uint256 amount) private view returns (uint256) {
    return amount * (10 ** _decimals);
  }

  function _distributePayment (address author, Rarity rarity) private returns (uint256) {
    uint256 toRewards;
    uint256 toAuthor;

    if (rarity == Rarity.UNCOMMON) {
      toRewards = _currency(900);
      toAuthor = _currency(100);
    } else if (rarity == Rarity.RARE) {
      toRewards = _currency(700);
      toAuthor = _currency(300);
    } else if (rarity == Rarity.EPIC) {
      toRewards = _currency(200);
      toAuthor = _currency(800);
    }

    uint256 payment = toRewards + toAuthor;

    pool.toRewards += toRewards;
    players[author].rewards += toAuthor;

    return payment;
  }

  function _getSkin (uint256 skinId) private view returns (Skin memory) {
    Skin memory skin = skins[skinId];
    //require(skin.author != address(0), "Skin not registered yet.");
    if (skin.author == address(0)) { revert IdDoesntExist(); }
    return skin;
  }

  function _getSkinId (uint256 shardId) private view returns (uint256) {
    uint256 skinId = skinShards[shardId];
    //require(skinId > 0, "Skin Shard not registered yet.");
    if (skinId == 0) { revert IdDoesntExist(); } 
    return skinId;
  }

  function _rng (uint256 range) private view returns (uint256) {
    return uint256(
      keccak256(
        abi.encode(block.timestamp, block.difficulty, msg.sender)
      )
    ) % range;
  }
}
