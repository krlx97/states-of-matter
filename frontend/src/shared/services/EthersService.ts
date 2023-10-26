import {get} from "svelte/store";
import {JsonRpcProvider, Contract, BrowserProvider} from "ethers";

import SomGame from "@som/contracts/SomGame/artifacts/SomGame.json" assert {
  type: "json"
};

import SomTokens from "@som/contracts/SomTokens/artifacts/SomTokens.json" assert {
  type: "json"
};

import {items} from "data";
import {accountStore, walletStore} from "stores";

const provider = window.ethereum ?
  new BrowserProvider(window.ethereum) :
  new JsonRpcProvider("https://testnet.telos.net");

const signer = await provider.getSigner();

const keys = {
  somTokens: "0x67330dE5F081a6d92DCa4917579935991F3F8413",
  somGame: "0x33d5072eD42ce7c61019454DECCAe48D559a9204"
};

const contracts = {
  somTokens: new Contract(keys.somTokens, SomTokens.abi, provider),
  somGame: new Contract(keys.somGame, SomGame.abi, provider)
};

const sign = {
  somTokens: contracts.somTokens.connect(signer),
  somGame: contracts.somGame.connect(signer)
};

const transact = async (contract: keyof typeof sign, action: string, params: any[]): Promise<boolean> => {
  const tx = await sign[contract][action](...params).catch(console.log);
  if (!tx) { return false; }
  const fin = await tx.wait();
  if (!fin) { return false; }
  return true;
};

const reloadUser = async (): Promise<void> => {
  const {somTokens, somGame} = contracts;
  const key = get(accountStore).publicKey;
  // const player = await somGame.players(key);
  // const total = await somGame.total();
  // console.log(player);
  const theItems = [];

  for (const item of items) {
    theItems.push({
      id: item.id,
      balance: 100n
    });
  }

  walletStore.set({
    ese: {
      balance: 100000n
      // balance: await somTokens.balanceOf(key, 0)
    },
    ecr: {
      balance: 1000000000000000000000n,
      staked: 1000000000000000000000n,
      unstaked: 1000000000000000000000n,
      vesting: 100,
      rewards: 1000000000000000000000n,
      airdrops: 100,
      starterPack: true
      // balance: await somTokens.balanceOf(key, 1),
      // staked: await player.staking(1).staked,
      // unstaked: await player.staking(1).unstaked,
      // vesting: await player.staking(1).vesting,
      // rewards: player.rewards,
      // airdrops: player.airdrops,
      // starterPack: player.hasClaimedStarterPack
    },
    wtlos: {
      balance: 10000000000000000000n
      // balance: await somTokens.balanceOf(key, 2)
    },
    lpecr: {
      balance: 10000000000000000000000n,
      staked: 100000000000000000000n,
      unstaked: 10000000000000000000n,
      vesting: 1000,
      // balance: await somTokens.balanceOf(key, 3),
      // staked: await player.staking(3).staked,
      // unstaked: await player.staking(3).unstaked,
      // vesting: await player.staking(3).vesting,
    },
    liquidity: {
      ecr: 10000000000000000000000n,
      wtlos: 1000000000000000000000n
    },
    crystalsGlobal: {
      totalSupply: 1000000000000000000000000000n,
      staked: 112300000000000000000000000n,
      unstaked: 151584720000000000000000000n,
      rewards: 100000000000000000000n,
      burned: 45126670000000000000000000n,
      firstDailyWins: 165,
      airdrops: 47654,
      // totalSupply: await somTokens.totalSupply(1),
      // staked: await total.staked(1),
      // unstaked: await total.unstaked(1),
      // rewards: total.rewards,
      // liquidity: total.liquidity,
      // burned: total.burned,
      // firstDailyWins: total.firstDailyWins,
      // airdrops: total.airdrops,
    },
    lpecrGlobal: {
      totalSupply: 100000n * 10n ** 18n,
      staked: 11230n * 10n ** 18n,
      unstaked: 15158n * 10n ** 18n,
    },
    isApprovedForAll: true,
    starterPack: false,
    // isApprovedForAll: await somTokens.isApprovedForAll(key, keys.somGame),
    items: theItems
  });
}

const ethersService = {key: "", keys, contracts, transact, reloadUser};

export {ethersService};
