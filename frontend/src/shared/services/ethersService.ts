import {get} from "svelte/store";
import {Contract, BrowserProvider, JsonRpcProvider, JsonRpcSigner} from "ethers";
import {items} from "@som/shared/data";
import {playerStore, ethersStore, inventoryStore} from "stores";

import EthericEssence from "@som/contracts/EthericEssence/artifacts/EthericEssence.json" assert {
  type: "json"
};

import EthericCrystals from "@som/contracts/EthericCrystals/artifacts/EthericCrystals.json" assert {
  type: "json"
};

import EthericEnergy from "@som/contracts/EthericEnergy/artifacts/EthericEnergy.json" assert {
  type: "json"
};

import SomGame from "@som/contracts/Game/artifacts/Game.json" assert {
  type: "json"
};

import SomTokens from "@som/contracts/Items/artifacts/Items.json" assert {
  type: "json"
};

const keys = {
  ethericEssence: "0xD2c7143A714573f767a9E8acF64315a6Ef418231",
  ethericCrystals: "0xd393F4A7a9b2937fb8cb30Ae3e03866755c37Ba3",
  ethericEnergy: "0xa151F99db0d89B9d1D568e56fcE5d7ac84355A5E",
  somTokens: "0xA857C3e9770dC18ee6a022691cAA62f3Afa777E1",
  somGame: "0x1dfF35052F1FE01EdB2d767D9e8F644B9c271108"
};

const init = async (address: string): Promise<void> => {
  if (window.ethereum) {
    let provider = new BrowserProvider(window.ethereum);
    let signer: JsonRpcSigner | undefined;

    if (address.length) {
      signer = new JsonRpcSigner(provider, address);
    }

    ethersStore.update((store) => {
      store.contracts = {
        ethericEssence: new Contract(keys.ethericEssence, EthericEssence.abi, signer ? signer : provider),
        ethericCrystals: new Contract(keys.ethericCrystals, EthericCrystals.abi, signer ? signer : provider),
        ethericEnergy: new Contract(keys.ethericEnergy, EthericEnergy.abi, signer ? signer : provider),
        somTokens: new Contract(keys.somTokens, SomTokens.abi, signer ? signer : provider),
        somGame: new Contract(keys.somGame, SomGame.abi, signer ? signer : provider)
      };

      return store;
    });
  } else {
    const provider = new JsonRpcProvider("https://testnet.telos.net/evm");

    ethersStore.update((store) => {
      store.contracts = {
        ethericEssence: new Contract(keys.ethericEssence, EthericEssence.abi, provider),
        ethericCrystals: new Contract(keys.ethericCrystals, EthericCrystals.abi, provider),
        ethericEnergy: new Contract(keys.ethericEnergy, EthericEnergy.abi, provider),
        somTokens: new Contract(keys.somTokens, SomTokens.abi, provider),
        somGame: new Contract(keys.somGame, SomGame.abi, provider)
      };

      return store;
    });
  }
};

const transact = async (
  contractName: keyof typeof keys,
  action: string,
  params: Array<string | bigint>
): Promise<boolean> => {
  const $ethersStore = get(ethersStore);
  const contract = $ethersStore.contracts[contractName];

  if (!contract) {
    return false;
  }

  const transaction = await contract[action](...params).catch(console.log);

  if (!transaction) {
    return false;
  }

  const receipt = await transaction.wait().catch(console.log);

  if (!receipt) {
    return false;
  }

  return true;
};

const sign = async (message: string): Promise<{signature: string, address: string} | void> => {
  // const store = get(ethersStore);
  // const {signer} = store;
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  if (!signer) {
    return console.log("Metamask not connected");
  }

  const signature = await signer.signMessage(message);
  const address = await signer.getAddress();

  return {signature, address};
};

const reloadUser = async (): Promise<void> => {
  const {
    ethericEssence,
    ethericCrystals,
    ethericEnergy,
    somTokens,
    somGame
  } = get(ethersStore).contracts;

  const $ethersStore = get(ethersStore);
  const {address, elo} = get(playerStore);

  if ($ethersStore.chainId !== /*1337n*/41n) {
    ethersStore.update((store) => {
      store.isLoaded = true;
      return store;
    });

    return;
  }

  if (address) {
    const accounts = await window.ethereum?.request({
      method: "eth_accounts"
    })

    if (!accounts.length) {
      ethersStore.update((store) => {
        store.accounts = [];
        store.isLoaded = true;
        return store;
      });

      return;
    }

    ethersStore.update((store) => {
      store.accounts = accounts || [];
      return store;
    });

    const theItems = [];

    const itemIds = items
      .filter((item): boolean => item.rarity !== 0)
      .map((item): bigint => BigInt(item.id));

    const query = itemIds.map(() => address);
    const bal = await somTokens.balanceOfBatch(query, itemIds);
    const balances = [];

    itemIds.forEach((id, i) => {
      balances.push({id, balance: bal[i]});
    });

    for (const item of items) {
      const {id, rarity} = item;

      if (id === 100 || id === 200) { // bronze
        theItems.push({
          id: BigInt(id),
          balance: 1n,
          supply: 0n
        });
      } else if (id === 101 || id === 201) { // silver
        theItems.push({
          id: BigInt(id),
          balance: elo >= 600 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 102 || id === 202) { // gold
        theItems.push({
          id: BigInt(id),
          balance: elo >= 800 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 103 || id === 203) { // master
        theItems.push({
          id: BigInt(id),
          balance: elo >= 1000 ? 1n : 0n,
          supply: 0n
        });
      } else {
        if (rarity === 0) {
          theItems.push({
            id: BigInt(id),
            balance: 1n,
            supply: 0n
          });
        } else {
          const balance = balances.find((b) => b.id === BigInt(id));

          theItems.push({
            id: BigInt(id),
            balance: balance.balance,
            supply: /*await somTokens["totalSupply(uint256)"](id)*/0n
          });
        }
      }
    }

    const [
      eesBalance,
      ecrBalance,
      enrgBalance,
      itemApproval,
      eesApproval,
      ecrApproval,
      enrgApproval,
      eesSupply,
      ecrSupply,
      enrgSupply,
      deployTimestamp,
      chests
    ] = await Promise.all([
      ethericEssence.balanceOf(address),
      ethericCrystals.balanceOf(address),
      ethericEnergy.balanceOf(address),
      somTokens.isApprovedForAll(address, keys.somGame),
      ethericEssence.allowance(address, keys.somGame),
      ethericCrystals.allowance(address, keys.somGame),
      ethericEnergy.allowance(address, keys.somGame),
      ethericEssence.totalSupply(),
      ethericCrystals.totalSupply(),
      ethericEnergy.totalSupply(),
      somGame.deployTimestamp(),
      somTokens.balanceOf(address, 1)
    ]);

    inventoryStore.set({
      ees: eesBalance,
      ecr: ecrBalance,
      enrg: enrgBalance,
      approvals: {
        items: itemApproval,
        ees: eesApproval,
        ecr: ecrApproval,
        enrg: enrgApproval
      },
      total: {
        ees: eesSupply,
        ecr: ecrSupply,
        enrg: enrgSupply
      },
      deployTimestamp: deployTimestamp,
      chests: chests,
      items: theItems
    });
  } else {
    const theItems = [];

    for (const item of items) {
      const {id} = item;

      if (id === 100 || id === 200) { // bronze
        theItems.push({
          id: BigInt(id),
          balance: 1n,
          supply: 0n
        });
      } else if (id === 101 || id === 201) { // silver
        theItems.push({
          id: BigInt(id),
          balance: elo >= 600 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 102 || id === 202) { // gold
        theItems.push({
          id: BigInt(id),
          balance: elo >= 800 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 103 || id === 203) { // master
        theItems.push({
          id: BigInt(id),
          balance: elo >= 1000 ? 1n : 0n,
          supply: 0n
        });
      } else {
        if (item.rarity === 0) {
          theItems.push({
            id: BigInt(id),
            balance: 1n,
            supply: 0n
          });
        } else {
          theItems.push({
            id: BigInt(id),
            balance: 0n,
            supply: /*await somTokens["totalSupply(uint256)"](id)*/0n
          });
        }
      }
    }

    inventoryStore.set({
      ees: 0n,
      ecr: 0n,
      enrg: 0n,
      approvals: {
        items: false,
        ees: 0n,
        ecr: 0n,
        enrg: 0n
      },
      total: {
        ees: await ethericEssence.totalSupply(),
        ecr: await ethericCrystals.totalSupply(),
        enrg: await ethericEnergy.totalSupply()
      },
      deployTimestamp: await somGame.deployTimestamp(),
      chests: 0n,
      items: theItems
    });
  }

  ethersStore.update((store) => {
    store.isLoaded = true;
    return store;
  });
};

const ethersService = {keys, init, transact, sign, reloadUser};

export {ethersService};
