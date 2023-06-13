import { BigNumber } from "ethers";
import { writable } from "svelte/store";

const walletStore = writable({
  crystals: {
    balance: BigNumber.from(0),
    staked: BigNumber.from(0),
    unstaked: BigNumber.from(0),
    vesting: 0,
    rewards: BigNumber.from(0),
    airdrops: 0,
    starterPack: true,
  liquidity: BigNumber.from(0),
  },
  crystalsGlobal: {
    cap: BigNumber.from(0),
    totalSupply: BigNumber.from(0),
    staked: BigNumber.from(0),
    unstaked: BigNumber.from(0),
    burned: BigNumber.from(0),
    rewards: BigNumber.from(0),
    airdrops: 0
  },
  crystalsPool: {
    toRewards: BigNumber.from(0),
    toBurned: BigNumber.from(0)
  },
  essence: {
    balance: BigNumber.from(0)
  },
  isApprovedForAll: false,
  allowance: BigNumber.from(0),
  items: []
});

export {walletStore};
