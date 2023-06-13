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
  // ----- Stake -----
  function stake (uint256 amount) public {
    //require(amount > 0, "Must stake positive amount.");
    if (amount < 0) { revert NegativeAmount(); }
    //require(amount % (10 ** _decimals) == 0, "No decimals allowed.");
    if (amount % (10 ** _decimals) != 0) { revert InvalidDecimals(); }

    _stake(msg.sender, amount);

    somCurrency.transferFrom(msg.sender, address(this), amount);
  }

  function unstake (uint256 amount) public {
    Player storage player = players[msg.sender];

    //require(amount > 0, "Must unstake positive amount.");
    if (amount < 0) { revert NegativeAmount(); }
    //require(amount % (10 ** _decimals) == 0, "No decimals allowed.");
    if (amount % (10 ** _decimals) != 0) { revert InvalidDecimals(); }
    //require(player.staked >= amount, "Insufficient staked.");
    if (amount > player.staked) { revert InsufficientAmount(); }

    total.staked -= amount;
    total.unstaked += amount;
    player.staked -= amount;
    player.unstaked += amount;

    if (msg.sender == _devAddress) {
      player.vesting = block.timestamp + 10 minutes;
    } else {
      player.vesting = block.timestamp + 5 minutes;
    }
  }

  function claimUnstaked () public {
    Player storage player = players[msg.sender];

    //require(player.vesting <= block.timestamp, "Not vested yet.");
    if (player.vesting > block.timestamp) { revert NotVested(); }

    uint256 unstaked = player.unstaked;

    total.unstaked -= unstaked;
    player.unstaked = 0;
    player.vesting = 0;

    somCurrency.transfer(msg.sender, unstaked);
  }

  function claimAirdrops () public {
    Player storage player = players[msg.sender];

    //require(player.airdrops > 0, "No airdrops remaining.");
    if (player.airdrops < 0) { revert InsufficientAmount(); }

    uint256 playerBalanceAmount = player.airdrops * _currency(500);
    uint256 playerStakedAmount = player.airdrops * _currency(1000);
    uint256 devStakedAmount = player.airdrops * _currency(500);
    uint256 totalAmount = playerBalanceAmount + playerStakedAmount + devStakedAmount;

    _stake(msg.sender, playerStakedAmount);
    _stake(_devAddress, devStakedAmount);

    player.airdrops = 0;

    somCurrency.mint(address(this), totalAmount);
    somCurrency.transfer(msg.sender, playerBalanceAmount);
  }

  function claimRewards () public {
    Player storage player = players[msg.sender];

    //require(player.rewards > 0, "No rewards to claim.");
    if (player.rewards < 0) { revert InsufficientAmount(); }

    uint256 rewards = player.rewards;

    player.rewards = 0;

    somCurrency.transfer(msg.sender, rewards);
  }

  function claimStarterPack () public {
    Player storage player = players[msg.sender];

    require(!player.hasClaimedStarterPack, "Starter pack claimed already.");

    _airdrop(msg.sender, 100);

    player.hasClaimedStarterPack = true;

    somSkins.mint(msg.sender, 0, 100000, "");
    somSkins.mint(msg.sender, 10, 100, "");
    somSkins.mint(msg.sender, 11, 100, "");
    somSkins.mint(msg.sender, 1001, 90, "");
    somSkins.mint(msg.sender, 1003, 90, "");
    somSkins.mint(msg.sender, 1005, 90, "");
    somSkins.mint(msg.sender, 1007, 90, "");
    somSkins.mint(msg.sender, 1009, 90, "");
    somSkins.mint(msg.sender, 1011, 90, "");
    somSkins.mint(msg.sender, 1013, 90, "");
    somSkins.mint(msg.sender, 1015, 90, "");
    somSkins.mint(msg.sender, 1017, 90, "");
  }
  // ----- Skins -----
  function unlockChest (uint256 chestId) public {
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
  // ----- Swap -----
  // Function to get reserves
  function getReserves () public view returns (uint256 _reserve1, uint256 _reserve2) {
    _reserve1 = reserve1;
    _reserve2 = reserve2;
  }

  // Internal function to mint liquidity shares
  function _mint(address _to, uint256 _amount) private {
    userLiquidity[_to] += _amount;
    totalLiquidity += _amount;
  }

  // Internal function to burn liquidity shares
  function _burn(address _from, uint256 _amount) private {
    userLiquidity[_from] -= _amount;
    totalLiquidity -= _amount;
  }

  // Internal function to update liquidity pool reserves
  function _update (uint256 _reserve1, uint256 _reserve2) private {
    reserve1 = _reserve1;
    reserve2 = _reserve2;
  }

  // Function for user to swap tokens
  // NOTE: Could possibly make this into 2 functions for gas saving
  function swapTokens (address _tokenIn, uint256 _amountIn) external returns (uint256 _amountOut) {
    require(
      _tokenIn == address(token1) || _tokenIn == address(token2),
      "Invalid Token Address"
    );

    // Retrieve the "token in" token
    bool isToken1 = _tokenIn == address(token1);

    (uint256 _reserve1, uint256 _reserve2) = getReserves();

    (
      IERC20 tokenIn,
      IERC20 tokenOut,
      uint256 reserveIn,
      uint256 reserveOut
    ) = isToken1 ?
      (token1, token2, _reserve1, _reserve2) :
      (token2, token1, _reserve2, _reserve1);

    // Transfer tokenIn to the liquity pool
    require(_amountIn > 0, "Insufficient Amount");
    tokenIn.transferFrom(msg.sender, address(this), _amountIn);

    // Calculate tokenIn with fee of 0.2%
    uint256 _amountInWithFee = (_amountIn * 998) / 1000;

    _amountOut = (reserveOut * _amountInWithFee) / (reserveIn + _amountInWithFee);

    require(_amountOut < reserveOut, "Insufficient Liquidity");

    // Transfer tokenOut to the user
    tokenOut.transfer(msg.sender, _amountOut);

    // Update the reserves
    _update(
      token1.balanceOf(address(this)),
      token2.balanceOf(address(this))
    );
  }

  // Function for user to add liquidity
  function addLiquidity (uint256 _amountToken1, uint256 _amountToken2) external returns (uint256 _liquidityShares) {
    // User sends both tokens to liquidity pool
    require(
      token1.transferFrom(msg.sender, address(this), _amountToken1),
      "Token Transfer Failed"
    );
    require(
      token2.transferFrom(msg.sender, address(this), _amountToken2),
      "Token Transfer Failed"
    );

    (uint256 _reserve1, uint256 _reserve2) = getReserves();

    if (_reserve1 > 0 || _reserve2 > 0) {
      require(
        _amountToken1 * _reserve2 == _amountToken2 * _reserve1,
        "Unbalanced Liquidity Provided"
      );
    }

    uint256 _totalLiquidity = totalLiquidity;

    if (_totalLiquidity == 0) {
      _liquidityShares = _sqrt(_amountToken1 * _amountToken2);
    } else {
      _liquidityShares = _min(
        ((_amountToken1 * _totalLiquidity) / _reserve1),
        ((_amountToken2 * _totalLiquidity) / _reserve2)
      );
    }

    require(_liquidityShares > 0, "No Liquidity Shares Minted");
    // Mint shares to user
    _mint(msg.sender, _liquidityShares);

    // Update the reserves
    _update(
      token1.balanceOf(address(this)),
      token2.balanceOf(address(this))
    );

    emit MintLpToken(msg.sender, _liquidityShares);
  }

  function removeLiquidity (uint256 _liquidityShares) external returns (
    uint256 _amountToken1,
    uint256 _amountToken2
  ) {
    require(
      userLiquidity[msg.sender] >= _liquidityShares,
      "Insufficient liquidity shares"
    );
    // Get balance of both tokens
    uint256 token1Balance = token1.balanceOf(address(this));
    uint256 token2Balance = token2.balanceOf(address(this));

    uint256 _totalLiquidity = totalLiquidity;

    _amountToken1 = (_liquidityShares * token1Balance) / _totalLiquidity;
    _amountToken2 = (_liquidityShares * token2Balance) / _totalLiquidity;

    require(
      _amountToken1 > 0 && _amountToken2 > 0,
      "Insufficient transfer amounts"
    );

    // Burn user liquidity shares
    _burn(msg.sender, _liquidityShares);

    // Update reserves
    _update(token1Balance - _amountToken1, token2Balance - _amountToken2);

    // Transfer tokens to user
    token1.transfer(msg.sender, _amountToken1);
    token2.transfer(msg.sender, _amountToken2);

    emit BurnLpToken(msg.sender, _liquidityShares);
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

  function giveRewards () public onlyOwner {
    //require(total.staked > 0, "No staked tokens to distribute rewards to.");
    if (total.staked < 0) { revert InsufficientAmount(); }
    //require(pool.toRewards > 0, "No rewards to distribute.");
    if (pool.toRewards < 0) { revert InsufficientAmount(); }

    uint256 rewardPerStaked = (pool.toRewards * (10 ** _decimals)) / total.staked;
    uint256 issued;

    for (uint256 i = 0; i < _stakers.length; i ++) {
      address account = _stakers[i];
      Player storage player = players[account];

      if (player.staked > 0) {
        uint256 playerReward = (player.staked / (10 ** _decimals)) * rewardPerStaked;

        player.rewards += playerReward;
        issued += playerReward;
      }
    }

    uint256 toBurn = pool.toBurned;

    pool.toBurned = 0;
    pool.toRewards -= issued;
    total.burned += toBurn;
    total.rewards += issued;

    somCurrency.burn(toBurn);
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
  function _airdrop (address account, uint16 amount) private {
    if (total.airdrops < 1) { return; }

    if (total.airdrops < amount) {
      players[account].airdrops = total.airdrops;
      total.airdrops = 0;
    } else {
      total.airdrops -= amount;
      players[account].airdrops += amount;
    }
  }

  function _stake (address account, uint256 amount) private {
    Player storage player = players[account];

    if (!player.isStaker) {
      _stakers.push(account);
      player.isStaker = true;
    }

    total.staked += amount;
    player.staked += amount;
  }

  function _currency (uint256 amount) private view returns (uint256) {
    return amount * (10 ** _decimals);
  }

  function _distributePayment (address author, Rarity rarity) private returns (uint256) {
    uint256 toRewards;
    uint256 toAuthor;

    if (rarity == Rarity.UNCOMMON) {
      toRewards = _currency(800);
      toAuthor = _currency(100);
    } else if (rarity == Rarity.RARE) {
      toRewards = _currency(600);
      toAuthor = _currency(300);
    } else if (rarity == Rarity.EPIC) {
      toRewards = _currency(100);
      toAuthor = _currency(800);
    }

    uint256 toBurn = _currency(100);
    uint256 payment = toRewards + toAuthor + toBurn;

    pool.toRewards += toRewards;
    pool.toBurned += toBurn;
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

  function _sqrt (uint256 y) private pure returns (uint256 z) {
    if (y > 3) {
      z = y;
      uint256 x = y / 2 + 1;
      while (x < z) {
        z = x;
        x = (y / x + x) / 2;
      }
    } else if (y != 0) {
      z = 1;
    }
  }

  function _min (uint256 x, uint256 y) private pure returns (uint256 z) {
    z = x < y ? x : y;
  }
}
