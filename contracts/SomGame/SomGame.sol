// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/utils/ERC1155Holder.sol";
import "../SomTokens/SomTokens.sol";

/// @custom:security-contact krlebyte@gmail.com
contract SomGame is ERC1155Holder, Ownable {
  event RandomSkin (address indexed account, uint256 id);
  event ListItem (address indexed seller, uint256 listingId, uint256 skinId, uint256 amount, uint256 price);
  event CancelItem (uint256 listingId);
  event BuyItem (uint256 listingId, uint256 amount);

  error AlreadyClaimed (); // used
  error NegativeAmount ();
  error InsufficientAmount ();
  error InvalidDecimals ();
  error InvalidAmount (); // used
  error InvalidToken (); // used
  error NotVested (); // used
  error IdInvalid ();
  error IdNotEven ();
  error IdExists ();
  error IdDoesntExist ();

  enum Rarity {UNCOMMON, RARE, EPIC}
  enum ItemType {CHEST, SHARD, SKIN}

  struct EcrRewards {
    uint256 pool;
    uint256 issued;
  }

  struct Liquidity {
    uint256 ecr;
    uint256 wtlos;
  }

  struct Total {
    uint256 burned;
    uint32 firstDailyWins;
    uint32 airdrops;
  }

  struct PlayerStake {
    uint256 staked;
    uint256 unstaked;
    uint256 vesting;
  }

  struct TotalStake {
    uint256 staked;
    uint256 unstaked;
  }

  struct Player {
    uint256 rewards;
    uint32 airdrops;
    bool isStaker;
    bool isRegistered;
    bool hasClaimedStarterPack;
    bool firstDailyWin;
  }

  struct Item {
    uint256 id;
    uint256 amount;
    uint256 price;
    address seller;
  }

  mapping(address => Player) public players;
  mapping(address => mapping(uint256 => PlayerStake)) playerStakes;
  mapping(uint256 => TotalStake) totalStakes;
  mapping(uint256 => mapping(Rarity => uint256[])) public chests;
  mapping(uint256 => Rarity) public skins;
  mapping(uint256 => uint256) public skinShards;
  mapping(uint256 => Item) public items;
  mapping(Rarity => uint256) private _craftPrice;
  mapping(Rarity => uint256) private _disenchantReward;

  address private immutable _devAddress;

  uint256 private constant DECIMALS = 18;
  uint256 private constant ESE = 0;
  uint256 private constant ECR = 1;
  uint256 private constant LPECR = 2;
  uint256 private constant WTLOS = 3;
  uint256 chestUnlockPrice = 1000 * 10 ** 18;

  address[] private _stakers;
  address[] private _players;
  uint256[] private _chestIds;
  uint256 private _lastItem;

  Total public total;
  Liquidity public liquidity;
  EcrRewards public ecrRewards;
  SomTokens public somTokens;

  constructor (address dev, address erc1155) {
    somTokens = SomTokens(erc1155);

    total.airdrops = 100000;
    _devAddress = dev;

    _craftPrice[Rarity.UNCOMMON] = 50;
    _craftPrice[Rarity.RARE] = 500;
    _craftPrice[Rarity.EPIC] = 5000;

    _disenchantReward[Rarity.UNCOMMON] = 100;
    _disenchantReward[Rarity.RARE] = 1000;
    _disenchantReward[Rarity.EPIC] = 10000;
  }

  // ---------- S T A K I N G ✓ ----------

  function stake (uint256 id, uint256 amount) external {
    if (id != ECR || id != LPECR) {
      revert InvalidToken();
    }

    if (amount < 1) {
      revert InvalidAmount();
    }

    totalStakes[id].staked += amount;
    playerStakes[msg.sender][id].staked += amount;

    somTokens.safeTransferFrom(msg.sender, address(this), id, amount, "");
  }

  function unstake (uint256 id, uint256 amount) external {
    if (amount < 1) {
      revert InvalidAmount();
    }

    PlayerStake storage playerStake = playerStakes[msg.sender][id];

    if (amount > playerStake.staked) {
      revert InvalidAmount();
    }

    TotalStake storage totalStake = totalStakes[id];
    bool isDev = msg.sender == _devAddress;

    totalStake.staked -= amount;
    totalStake.unstaked += amount;
    playerStake.staked -= amount;
    playerStake.unstaked += amount;
    playerStake.vesting = block.timestamp + (isDev ? 10 minutes : 5 minutes);
  }

  function claimUnstaked (uint256 id) external {
    PlayerStake storage playerStake = playerStakes[msg.sender][id];

    if (playerStake.vesting > block.timestamp) {
      revert NotVested();
    }

    uint256 amount = playerStake.unstaked;

    totalStakes[id].unstaked -= amount;
    playerStake.unstaked = 0;
    playerStake.vesting = 0;

    somTokens.safeTransferFrom(address(this), msg.sender, id, amount, "");
  }

  function claimAirdrops () external {
    Player storage player = players[msg.sender];

    if (player.airdrops < 1) {
      revert InvalidAmount();
    }

    uint256 playerStakedAmount = player.airdrops * 750 * 10 ** DECIMALS;
    uint256 devStakedAmount = player.airdrops * 250 * 10 ** DECIMALS;
    uint256 totalAmount = playerStakedAmount + devStakedAmount;

    playerStakes[msg.sender][ECR].staked += playerStakedAmount;
    playerStakes[_devAddress][ECR].staked += devStakedAmount;
    totalStakes[ECR].staked += totalAmount;
    player.airdrops = 0;

    somTokens.mint(address(this), ECR, totalAmount, "");
  }

  function claimRewards () external {
    Player storage player = players[msg.sender];

    if (player.rewards < 1) {
      revert InvalidAmount();
    }

    uint256 amount = player.rewards;

    player.rewards = 0;

    somTokens.safeTransferFrom(address(this), msg.sender, ECR, amount, "");
  }

  function claimStarterPack () external {
    Player storage player = players[msg.sender];

    if (player.hasClaimedStarterPack) {
      revert AlreadyClaimed();
    }

    player.hasClaimedStarterPack = true;

    somTokens.mint(msg.sender, 0, 100000, "");
    somTokens.mint(msg.sender, 10, 100, "");
  }

  // ---------- S K I N S ✓ ----------

  function unlockChest (uint256 chestId) external {
    uint256 skinId = _randomSkin(chestId);
    ecrRewards.pool += chestUnlockPrice;
    emit RandomSkin(msg.sender, skinId);

    somTokens.safeTransferFrom(msg.sender, address(this), ECR, chestUnlockPrice, "");
    somTokens.burn(msg.sender, chestId, 1);
    somTokens.mint(msg.sender, skinId, 1, "");
  }

  function fuseShards (uint256 shardId) external {
    uint256 skinId = skinShards[shardId];
    ecrRewards.pool += chestUnlockPrice;

    somTokens.safeTransferFrom(msg.sender, address(this), ECR, chestUnlockPrice, "");
    somTokens.burn(msg.sender, shardId, 3);
    somTokens.mint(msg.sender, skinId, 1, "");
  }

  function craftShards (uint256 shardId, uint256 amount) external {
    Rarity rarity = skins[skinShards[shardId]];
    somTokens.burn(msg.sender, ESE, _craftPrice[rarity] * amount);
    somTokens.mint(msg.sender, shardId, amount, "");
  }

  function disenchantSkins (uint256 skinId, uint256 amount) external {
    Rarity rarity = skins[skinId];
    somTokens.burn(msg.sender, skinId, amount);
    somTokens.mint(msg.sender, ESE, _disenchantReward[rarity] * amount, "");
  }

  // ---------- M A R K E T ✓ ----------

  function listItem (uint256 id, uint256 amount, uint256 price) external {
    if (amount < 1) {
      revert InvalidAmount();
    }

    if (price < 1 * 10 ** DECIMALS) {
      revert InvalidAmount();
    }

    _lastItem += 1;
    items[_lastItem] = Item(msg.sender, id, amount, price);

    emit ListItem(msg.sender, _lastItem, id, amount, price);

    somTokens.safeTransferFrom(msg.sender, address(this), id, amount, "");
  }

  function cancelItem (uint256 id) external {
    Item storage item = items[id];

    if (msg.sender != item.seller) {
      revert InvalidAmount();
    }

    if (item.amount <= 0) {
      revert InvalidAmount();
    }

    uint256 amount = item.amount;

    item.amount = 0;

    emit CancelItem(id);

    somTokens.safeTransferFrom(address(this), msg.sender, item.id, amount, "");
  }

  function buyItem (uint256 listingId, uint256 amount) external {
    Item storage item = items[listingId];

    if (item.amount < amount) {
      revert InsufficientAmount();
    }

    uint256 totalPrice = item.price * amount;
    uint256 toRewards;

    toRewards = totalPrice / 100;

    uint256 toSeller = totalPrice - toRewards;

    item.amount -= amount;
    total.rewards.pool += toRewards;

    emit BuyItem(listingId, amount);

    somTokens.safeTransferFrom(msg.sender, item.seller, ECR, toSeller, "");
    somTokens.safeTransferFrom(address(this), msg.sender, item.id, amount, "");
  }

  // ---------- L I Q U I D I T Y ✓ ----------

  function swap (uint256 id, uint256 amountIn) external {
    if (id != ECR || id != WTLOS) {
      revert InvalidToken();
    }

    if (amountIn < 1) {
      revert InvalidAmount();
    }

    (
      uint256 idIn,
      uint256 idOut,
      uint256 reserveIn,
      uint256 reserveOut
    ) = id == ECR ?
      (ECR, WTLOS, total.liquidity.ecr, total.liquidity.wtlos) :
      (WTLOS, ECR, total.liquidity.wtlos, total.liquidity.ecr);

    uint256 afterFee = (amountIn * 99) / 100; // 1%
    uint256 amountOut = (reserveOut * afterFee) / (reserveIn + afterFee);

    if (amountOut > reserveOut) {
      revert InsufficientAmount();
    }

    if (id == ECR) {
      total.liquidity.ecr += amountIn;
      total.liquidity.wtlos -= amountOut;
    } else {
      total.liquidity.ecr -= amountOut;
      total.liquidity.wtlos += amountIn;
    }

    somTokens.safeTransferFrom(msg.sender, address(this), idIn, amountIn, "");
    somTokens.safeTransferFrom(address(this), msg.sender, idOut, amountOut, "");
  }

  function addLiquidity (uint256 ecr, uint256 wtlos) external {
    if (total.liquidity.ecr > 0 || total.liquidity.wtlos > 0) {
      require(
        ecr * total.liquidity.wtlos == wtlos * total.liquidity.ecr,
        "Unbalanced Liquidity Provided"
      );
    }

    uint256 lpecr;
    uint256 totalLpecr = somTokens.totalSupply(LPECR);

    if (totalLpecr == 0) {
      uint256 y = ecr * wtlos;

      if (y > 3) {
        lpecr = y;
        uint256 x = y / 2 + 1;

        while (x < lpecr) {
          lpecr = x;
          x = (y / x + x) / 2;
        }
      } else if (y != 0) {
        lpecr = 1;
      }
    } else {
      uint256 ecrLiq = (ecr * totalLpecr) / total.liquidity.ecr;
      uint256 wtlosLiq = (wtlos * totalLpecr) / total.liquidity.wtlos;
      lpecr = ecrLiq < wtlosLiq ? ecrLiq : wtlosLiq;
    }

    require(lpecr > 0, "No liquidity shares minted.");

    total.liquidity.ecr += ecr;
    total.liquidity.wtlos += wtlos;

    somTokens.mint(msg.sender, LPECR, lpecr, "");
    somTokens.safeTransferFrom(msg.sender, address(this), ECR, ecr, "");
    somTokens.safeTransferFrom(msg.sender, address(this), WTLOS, wtlos, "");
  }

  function removeLiquidity (uint256 amount) external {
    uint256 balance = somTokens.balanceOf(msg.sender, LPECR);

    if (balance < amount) {
      revert InsufficientAmount();
    }

    uint256 totalLpecr = somTokens.totalSupply(LPECR);
    uint256 ecr = (amount * total.liquidity.ecr) / totalLpecr;
    uint256 wtlos = (amount * total.liquidity.wtlos) / totalLpecr;

    if (ecr < 1 && wtlos < 1) {
      revert InsufficientAmount();
    }

    total.liquidity.ecr -= ecr;
    total.liquidity.wtlos -= wtlos;

    somTokens.burn(msg.sender, LPECR, amount);
    somTokens.safeTransferFrom(address(this), msg.sender, ECR, ecr, "");
    somTokens.safeTransferFrom(address(this), msg.sender, WTLOS, wtlos, "");
  }

  function wrap () external payable {
    somTokens.mint(msg.sender, WTLOS, msg.value, "");
  }

  function unwrap (uint256 amount) external {
    payable(msg.sender).transfer(amount);
    somTokens.burn(msg.sender, WTLOS, amount);
  }

  // ---------- A D M I N ----------

  function addPlayer (address account) external onlyOwner {
    _players.push(account);
  }

  function addChest (uint256 id) external onlyOwner {
    if (id < 10 || id > 99) {
      revert IdInvalid();
    }

    _chestIds.push(id);
  }

  function addSkin (uint256 id, Rarity rarity) external onlyOwner {
    if (id < 1000 || id > 999999) {
      revert IdInvalid();
    }

    if (id % 2 != 0) {
      revert IdNotEven();
    }

    skins[id] = rarity;
    skinShards[id + 1] = id;
  }

  function addSkinToChest (uint256 skinId, uint256 chestId) external onlyOwner {
    chests[chestId][skins[skinId]].push(skinId);
  }

  // total.rewards.pool - 50% burn, 25% LPECR, 25% ECR
  // loop all players using range (100 users per range?)
  // check if player has first win, or staked ECR or LPECR
  // distribute accordingly
  // if _players.length < range * 100, recursively call giveRewards
  function giveRewards () external onlyOwner {
    if (total.staked[ECR] < 1 && total.staked[LPECR] < 1) {
      revert InsufficientAmount();
    }

    if (total.rewards.pool < 1) {
      revert InsufficientAmount();
    }

    uint256 burned = total.rewards.pool / 2;
    uint256 perEcrStaked = (total.rewards.pool / 4 * (10 ** DECIMALS)) / total.staked[ECR];
    uint256 perLpecrStaked = (total.rewards.pool / 4 * (10 ** DECIMALS)) / total.staked[LPECR];
    uint256 perInflationPool = (100000 * 10 ** DECIMALS) / total.firstDailyWins;
    uint256 issued;

    for (uint256 i = 0; i < _players.length; i ++) {
      address account = _players[i];
      Player storage player = players[account];

      if (player.staking[ECR].staked > 0) {
        uint256 playerReward = (player.staking[ECR].staked / (10 ** DECIMALS)) * perEcrStaked;
        player.rewards += playerReward;
        issued += playerReward;
      }

      if (player.staking[LPECR].staked > 0) {
        uint256 playerReward = (player.staking[LPECR].staked / (10 ** DECIMALS)) * perLpecrStaked;
        player.rewards += playerReward;
        issued += playerReward;
      }

      if (player.firstDailyWin) {
        player.rewards += perInflationPool;
        player.firstDailyWin = false;
      }
    }

    total.burned += burned;
    total.rewards.issued += issued;
    total.rewards.pool -= issued;

    somTokens.burn(address(this), ECR, burned);
    somTokens.mint(address(this), ECR, 100000 * 10 ** 18, "");
  }

  function levelUp (address account, uint16 level) external onlyOwner {
    uint256[] memory ids;
    uint256[] memory amounts;

    ids[0] = 0;

    if (level % 1 == 0) {
      amounts[0] += 1;
    }

    if (level % 10 == 0) {
      ids[1] = _rng(_chestIds.length);
      amounts[0] += 30;
      amounts[1] = 1;
    }

    if (level % 100 == 0) {
      ids[2] = _randomSkin(10);
      amounts[0] += 600;
      amounts[2] = 1;
    }

    somTokens.mintBatch(account, ids, amounts, "");
  }

  function firstDailyWin (address account) external onlyOwner {
    if (total.airdrops >= 1) {
      players[account].airdrops += 1;
      total.airdrops -= 1;
    }

    players[account].firstDailyWin = true;
    total.firstDailyWins += 1;
  }

  // ---------- P R I V A T E ----------

  function _randomSkin (uint256 chestId) private view returns (uint256 skinId) {
    uint256 rarityRng = _rng(100); // 0-99
    Rarity rarity;

    if (rarityRng < 90) { // 0-89
      rarity = Rarity.UNCOMMON;
    } else if (rarityRng >= 90 && rarityRng < 99) { // 90-98
      rarity = Rarity.RARE;
    } else { // 99
      rarity = Rarity.EPIC;
    }

    uint256[] memory skinsList = chests[chestId][rarity];

    require(skinsList.length > 0, "No skins in the list yet.");

    skinId = skinsList[_rng(skinsList.length)];
  }

  function _rng (uint256 range) private view returns (uint256) {
    return uint256(
      keccak256(
        abi.encode(block.timestamp, block.difficulty, msg.sender)
      )
    ) % range;
  }
}
