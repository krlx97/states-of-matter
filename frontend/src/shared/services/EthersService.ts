import {get} from "svelte/store";
import {JsonRpcProvider, Contract, BrowserProvider, getDefaultProvider, JsonRpcSigner} from "ethers";

import SomGame from "@som/contracts/SomGame/artifacts/SomGame.json" assert {
  type: "json"
};

import SomTokens from "@som/contracts/SomTokens/artifacts/SomTokens.json" assert {
  type: "json"
};

import {items} from "data";
import {accountStore, ethersStore, walletStore} from "stores";

// class EthersService {
//   private provider: BrowserProvider | undefined;
//   private signer: JsonRpcSigner | undefined;

//   private readonly contracts: Contracts = {
//     somTokens: undefined,
//     somGame: undefined
//   }

//   public readonly keys = {
//     somTokens: "0x67330dE5F081a6d92DCa4917579935991F3F8413",
//     somGame: "0x33d5072eD42ce7c61019454DECCAe48D559a9204"
//   }

//   public async init (): Promise<void> {
//     this.provider = new BrowserProvider(window.ethereum);
//     this.signer = await this.provider.getSigner();
//     this.contracts.somTokens = new Contract(keys.somTokens, SomTokens.abi, this.signer);
//     this.contracts.somGame = new Contract(keys.somGame, SomGame.abi, this.signer);
//   }

//   public async transact (
//     contract: keyof typeof this.contracts,
//     action: string,
//     params: any[]
//   ): Promise<boolean> {
//     if (!this.contracts[contract]) {
//       console.error("Metamask not connected");
//       return false;
//     }
//     const tx = await this.contracts[contract][action](...params).catch(console.log);
//     if (!tx) { return false; }
//     const fin = await tx.wait();
//     if (!fin) { return false; }
//     return true;
//   }

//   public async sign (): Promise<void> {
//     if (!this.signer) {
//       return console.log("Metamask not connected");
//     }

//     console.log(this.signer.address);
//     const sig = await this.signer.signMessage("signup");
//     const address = await this.signer.getAddress();
//     console.log(sig, address);
//   }

//   public async reloadUser (): Promise<void> {
//     const {somTokens, somGame} = contracts;
//     const key = get(accountStore).publicKey;
//     // const player = await somGame.players(key);
//     // const total = await somGame.total();
//     // console.log(player);
//     const theItems = [];

//     for (const item of items) {
//       theItems.push({
//         id: item.id,
//         balance: 100n
//       });
//     }

//     walletStore.set({
//       ese: {
//         balance: 100000n
//         // balance: await somTokens.balanceOf(key, 0)
//       },
//       ecr: {
//         balance: 1000000000000000000000n,
//         staked: 1000000000000000000000n,
//         unstaked: 1000000000000000000000n,
//         vesting: 100,
//         rewards: 1000000000000000000000n,
//         airdrops: 100,
//         starterPack: true
//         // balance: await somTokens.balanceOf(key, 1),
//         // staked: await player.staking(1).staked,
//         // unstaked: await player.staking(1).unstaked,
//         // vesting: await player.staking(1).vesting,
//         // rewards: player.rewards,
//         // airdrops: player.airdrops,
//         // starterPack: player.hasClaimedStarterPack
//       },
//       wtlos: {
//         balance: 10000000000000000000n
//         // balance: await somTokens.balanceOf(key, 2)
//       },
//       lpecr: {
//         balance: 10000000000000000000000n,
//         staked: 100000000000000000000n,
//         unstaked: 10000000000000000000n,
//         vesting: 1000,
//         // balance: await somTokens.balanceOf(key, 3),
//         // staked: await player.staking(3).staked,
//         // unstaked: await player.staking(3).unstaked,
//         // vesting: await player.staking(3).vesting,
//       },
//       liquidity: {
//         ecr: 10000000000000000000000n,
//         wtlos: 1000000000000000000000n
//       },
//       crystalsGlobal: {
//         totalSupply: 1000000000000000000000000000n,
//         staked: 112300000000000000000000000n,
//         unstaked: 151584720000000000000000000n,
//         rewards: 100000000000000000000n,
//         burned: 45126670000000000000000000n,
//         firstDailyWins: 165,
//         airdrops: 47654,
//         // totalSupply: await somTokens.totalSupply(1),
//         // staked: await total.staked(1),
//         // unstaked: await total.unstaked(1),
//         // rewards: total.rewards,
//         // liquidity: total.liquidity,
//         // burned: total.burned,
//         // firstDailyWins: total.firstDailyWins,
//         // airdrops: total.airdrops,
//       },
//       lpecrGlobal: {
//         totalSupply: 100000n * 10n ** 18n,
//         staked: 11230n * 10n ** 18n,
//         unstaked: 15158n * 10n ** 18n,
//       },
//       isApprovedForAll: true,
//       starterPack: false,
//       // isApprovedForAll: await somTokens.isApprovedForAll(key, keys.somGame),
//       items: theItems
//     });
//   }
// }

let provider: BrowserProvider | undefined;
let signer: JsonRpcSigner | undefined;

// const provider = window.ethereum ?
//   new BrowserProvider(window.ethereum) :
//   new JsonRpcProvider("https://testnet.telos.net");

// const signer = await provider.getSigner();

const keys = {
  somTokens: "0x67330dE5F081a6d92DCa4917579935991F3F8413",
  somGame: "0x33d5072eD42ce7c61019454DECCAe48D559a9204"
};

interface Contracts {
  somTokens: Contract | undefined;
  somGame: Contract | undefined;
}

const contracts: Contracts = {
  somTokens: undefined,
  somGame: undefined
};

// const contracts = {
//   somTokens: new Contract(keys.somTokens, SomTokens.abi, provider), //ovde moze signer, i da se obrise sign objekat ispod
//   somGame: new Contract(keys.somGame, SomGame.abi, provider)
// };

// const sign = {
//   somTokens: contracts.somTokens.connect(signer),
//   somGame: contracts.somGame.connect(signer)
// };

const init = async () => {
  if (window.ethereum) {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    ethersStore.update((store) => {
      store.provider = provider;
      store.signer = signer;
      store.chainId = network.chainId;
      store.contracts = {
        somTokens: new Contract(keys.somTokens, SomTokens.abi, signer),
        somGame: new Contract(keys.somGame, SomGame.abi, signer)
      };
      store.isValid =
        window.ethereum !== undefined
        && signer?.address !== undefined
        && network.chainId === 41n;
      return store;
    });

    console.log(get(ethersStore));

    // provider = new BrowserProvider(window.ethereum);
    // signer = await provider.getSigner();
    contracts.somTokens = new Contract(keys.somTokens, SomTokens.abi, signer);
    contracts.somGame = new Contract(keys.somGame, SomGame.abi, signer)
  }
};

const transact = async (
  contractName: keyof typeof contracts,
  action: string,
  params: any[]
): Promise<boolean> => {
  const contract = contracts[contractName];

  if (!contract) {
    console.error("Metamask not connected.");
    return false;
  }

  const tx = await contract[action](...params).catch(console.log);

  if (!tx) {
    return false;
  }

  const fin = await tx.wait();

  if (!fin) {
    return false;
  }

  return true;
};

const sign = async (message: string): Promise<{signature: string, address: string} | void> => {
  const store = get(ethersStore);
  const {signer} = store;

  if (!signer) {
    return console.log("Metamask not connected");
  }

  const signature = await signer.signMessage(message);
  const address = await signer.getAddress();

  return {signature, address};
}

const reloadUser = async (): Promise<void> => {
  if (!contracts.somTokens || !contracts.somGame) {
    console.error("Metamask not connected");
    return;
  }

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

const ethersService = {keys, contracts, init, transact, sign, reloadUser};

// const ethersService = new EthersService();

export {ethersService};
