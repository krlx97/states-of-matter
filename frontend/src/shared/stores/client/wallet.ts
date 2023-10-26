import {writable} from "svelte/store";

const walletStore = writable({
  ese: {
    balance: 0n
  },
  ecr: {
    balance: 0n,
    staked: 0n,
    unstaked: 0n,
    vesting: 0,
    rewards: 0n,
    airdrops: 0,
    starterPack: true,
  },
  wtlos: {
    balance: 0n
  },
  lpecr: {
    balance: 0n,
    staked: 0n,
    unstaked: 0n,
    vesting: 0,
  },
  crystalsGlobal: {
    totalSupply: 0n,
    staked: 0n,
    unstaked: 0n,
    burned: 0n,
    rewards: 0n,
    firstDailyWins: 0,
    airdrops: 0
  },
  lpecrGlobal: {
    totalSupply: 0n,
    staked: 0n,
    unstaked: 0n
  },
  liquidity: {
    ecr: 0n,
    wtlos: 0n
  },
  isApprovedForAll: false,
  starterPack: false,
  items: []
});

export {walletStore};
