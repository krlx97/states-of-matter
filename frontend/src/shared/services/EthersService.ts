import {get} from "svelte/store";
import {Contract, BrowserProvider, JsonRpcProvider} from "ethers";
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
  ethericEssence: "0xDeCD7574fa58b52Dc87dDDB3BD376228D54E78a1",
  ethericCrystals: "0xf811f1AB4bfE4f58a703a0E32654a7789e7A9469",
  ethericEnergy: "0x51d94d7F370DAD3971f54baAb4911acFedbCf984",
  somTokens: "0xdF735A6a29a85E144623F8c6197b11134d4C11ae",
  somGame: "0x3BDCc313b07cAeA90Fc5323749D13F086a4b62e0"
};

const init = async () => {
  if (window.ethereum) {
    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    // const network = await provider.getNetwork();

    ethersStore.update((store) => {
      // store.provider = provider;
      // store.signer = signer;
      // store.chainId = network.chainId;
      store.contracts = {
        ethericEssence: new Contract(keys.ethericEssence, EthericEssence.abi, signer),
        ethericCrystals: new Contract(keys.ethericCrystals, EthericCrystals.abi, signer),
        ethericEnergy: new Contract(keys.ethericEnergy, EthericEnergy.abi, signer),
        somTokens: new Contract(keys.somTokens, SomTokens.abi, signer),
        somGame: new Contract(keys.somGame, SomGame.abi, signer)
      };
      // store.isValid =
      //   window.ethereum !== undefined
      //   && signer?.address !== undefined
      //   && network.chainId === /*1337n*/41n;
      return store;
    });
  } else {
    const provider = new JsonRpcProvider("https://testnet.telos.net/evm");

    ethersStore.update((store) => {
      // store.provider = new JsonRpcProvider("https://testnet.telos.net/evm") as any;
      // store.signer = signer;
      // store.chainId = /*1337n*/41n;
      store.contracts = {
        ethericEssence: new Contract(keys.ethericEssence, EthericEssence.abi, provider),
        ethericCrystals: new Contract(keys.ethericCrystals, EthericCrystals.abi, provider),
        ethericEnergy: new Contract(keys.ethericEnergy, EthericEnergy.abi, provider),
        somTokens: new Contract(keys.somTokens, SomTokens.abi, provider),
        somGame: new Contract(keys.somGame, SomGame.abi, provider)
      };
      // store.isValid =
      //   window.ethereum !== undefined
      //   && signer?.address !== undefined
      //   && network.chainId === /*1337n*/41n;
      return store;
    });
  }
};

const transact = async (
  contractName: any,
  action: string,
  params: any[]
): Promise<boolean> => {
  const store = get(ethersStore);
  const contract = store.contracts[contractName];

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

  const {address, elo} = get(playerStore);

  if (address) {
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

      if (id === 1000 || id === 2000) { // bronze
        theItems.push({
          id: BigInt(id),
          balance: 1n,
          supply: 0n
        });
      } else if (id === 1001 || id === 2001) { // silver
        theItems.push({
          id: BigInt(id),
          balance: elo >= 250 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 1002 || id === 2002) { // gold
        theItems.push({
          id: BigInt(id),
          balance: elo >= 500 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 1003 || id === 2003) { // master
        theItems.push({
          id: BigInt(id),
          balance: elo >= 750 ? 1n : 0n,
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

      if (id === 1000 || id === 2000) { // bronze
        theItems.push({
          id: BigInt(id),
          balance: 1n,
          supply: 0n
        });
      } else if (id === 1001 || id === 2001) { // silver
        theItems.push({
          id: BigInt(id),
          balance: elo >= 250 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 1002 || id === 2002) { // gold
        theItems.push({
          id: BigInt(id),
          balance: elo >= 500 ? 1n : 0n,
          supply: 0n
        });
      } else if (id === 1003 || id === 2003) { // master
        theItems.push({
          id: BigInt(id),
          balance: elo >= 750 ? 1n : 0n,
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
            supply: 0n
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
};

const ethersService = {keys, init, transact, sign, reloadUser};

export {ethersService};
