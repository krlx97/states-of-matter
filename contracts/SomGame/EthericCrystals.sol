// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../SomCurrency/SomCurrency.sol";

/// @custom:security-contact krlebyte@gmail.com
contract EthericCrystals is Ownable {
  error NegativeAmount ();
  error InsufficientAmount ();
  error InvalidDecimals ();
  error NotVested();

  struct Staker {
    uint256 staked;
    uint256 unstaked;
    uint256 vesting;
    uint256 rewards;
    uint16 airdrops;
    bool isStaker;
  }

  struct Total {
    uint256 staked;
    uint256 unstaked;
    uint256 rewards;
    uint256 burned;
    uint16 airdrops;
  }

  struct Pool {
    uint256 toRewards;
    uint256 toBurned;
  }

  mapping(address => Staker) public players;

  address[] private _stakers;

  uint256 private immutable _decimals;
  address private immutable _devAddress;

  Total public total;
  Pool public pool;

  SomCurrency public erc20;

  constructor (address dev, address erccontract) {
    erc20 = SomCurrency(erccontract);
    total.airdrops = 50000;
    _devAddress = dev;
    _decimals = erc20.decimals();
  }

  function stake (uint256 amount) public {
    require(amount > 0, "Must stake positive amount.");
    require(amount % (10 ** _decimals) == 0, "No decimals allowed.");

    _stake(msg.sender, amount);

    erc20.transferFrom(msg.sender, address(this), amount);
  }

  function unstake (uint256 amount) public {
    require(amount > 0, "Must unstake positive amount.");
    require(amount % (10 ** _decimals) == 0, "No decimals allowed.");

    Staker storage staker = players[msg.sender];

    require(staker.staked >= amount, "Insufficient staked.");

    total.staked -= amount;
    total.unstaked += amount;
    staker.staked -= amount;
    staker.unstaked += amount;

    if (msg.sender == _devAddress) {
      staker.vesting = block.timestamp + 10 minutes;
    } else {
      staker.vesting = block.timestamp + 5 minutes;
    }
  }

  function claimUnstaked () public {
    Staker storage staker = players[msg.sender];

    require(staker.vesting <= block.timestamp, "Not vested yet.");

    uint256 unstaked = staker.unstaked;

    total.unstaked -= unstaked;
    staker.unstaked = 0;
    staker.vesting = 0;

    erc20.transfer(msg.sender, unstaked);
  }

  function claimAirdrops () public {
    Staker storage staker = players[msg.sender];

    require(staker.airdrops > 0, "No airdrops remaining.");

    uint256 playerBalanceAmount = staker.airdrops * _currency(500);
    uint256 playerStakedAmount = staker.airdrops * _currency(1000);
    uint256 devStakedAmount = staker.airdrops * _currency(500);
    uint256 totalAmount = playerBalanceAmount + playerStakedAmount + devStakedAmount;

    _stake(msg.sender, playerStakedAmount);
    _stake(_devAddress, devStakedAmount);

    staker.airdrops = 0;

    erc20.mint(address(this), totalAmount);
    erc20.transfer(msg.sender, playerBalanceAmount);
  }

  function claimRewards () public {
    Staker storage staker = players[msg.sender];

    require(staker.rewards > 0, "No rewards to claim.");

    uint256 rewards = staker.rewards;

    staker.rewards = 0;

    erc20.transfer(msg.sender, rewards);
  }

  function distributeRewards () public onlyOwner {
    if (total.staked <= 0) { revert InsufficientAmount(); }
    if (pool.toRewards <= 0) { revert InsufficientAmount(); }

    uint256 rewardPerStaked = (pool.toRewards * (10 ** _decimals)) / total.staked;
    uint256 issued;

    for (uint256 i = 0; i < _stakers.length; i ++) {
      address account = _stakers[i];
      Staker storage player = players[account];

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

    erc20.burn(toBurn);
  }

  function _currency (uint256 amount) private view returns (uint256) {
    return amount * (10 ** _decimals);
  }

  function _stake (address account, uint256 amount) private {
    Staker storage staker = players[msg.sender];

    if (!staker.isStaker) {
      _stakers.push(account);
      staker.isStaker = true;
    }

    total.staked += amount;
    staker.staked += amount;
  }
}
