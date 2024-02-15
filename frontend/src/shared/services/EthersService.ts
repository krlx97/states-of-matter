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
  ethericEssence: "0x5E2b786F404eF4E824F731F5C055f57A9619E06b",
  ethericCrystals: "0x4f5e7F9785a102d351aD9Abd9F9ff595B702Df67",
  ethericEnergy: "0x9c324504ac273E90c2BC9c496Fd56b364Ca9aa72",
  somTokens: "0x0786BD21cb63d04a0EAe7B31a5c7813C3D1701d2",
  somGame: "0x4f5735538bE5491a2f466b48Cc9Cb4deE7D6181d"
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
  const store = get(ethersStore);
  const player = get(playerStore);
  const {contracts} = store;
  const {ethericEssence, ethericCrystals, ethericEnergy, somTokens, somGame} = contracts;
  const {address} = player;
  const theItems = [];

  for (const item of items) {
    if (item.id === 1000 || item.id === 2000) { // bronze
      theItems.push({
        ...item,
        balance: 1n,
        supply: 0n
      });
    } else if (item.id === 1001 || item.id === 2001) { // silver
      theItems.push({
        ...item,
        balance: player.elo >= 250 ? 1n : 0n,
        supply: 0n
      });
    } else if (item.id === 1002 || item.id === 2002) { // gold
      theItems.push({
        ...item,
        balance: player.elo >= 500 ? 1n : 0n,
        supply: 0n
      });
    } else if (item.id === 1003 || item.id === 2003) { // master
      theItems.push({
        ...item,
        balance: player.elo >= 750 ? 1n : 0n,
        supply: 0n
      });
    } else {
      if (item.rarity === 0) {
        theItems.push({
          ...item,
          balance: 1n,
          supply: 0n
        });
      } else {
        theItems.push({
          ...item,
          balance: address ? await somTokens.balanceOf(address, item.id) : 0n,
          supply: await somTokens["totalSupply(uint256)"](item.id)
        });
      }
    }
// fix slow loading times
//  gameItems.balanceOfBatch([playerAddress,playerAddress,playerAddress,playerAddress,playerAddress], [0,1,2,3,4])

  }

  if (address) {
    inventoryStore.set({
      ees: await ethericEssence.balanceOf(address),
      ecr: await ethericCrystals.balanceOf(address),
      enrg: await ethericEnergy.balanceOf(address),
      approvals: {
        items: await somTokens.isApprovedForAll(address, keys.somGame),
        ees: await ethericEssence.allowance(address, keys.somGame),
        ecr: await ethericCrystals.allowance(address, keys.somGame),
        enrg: await ethericEnergy.allowance(address, keys.somGame)
      },
      total: {
        ees: await ethericEssence.totalSupply(),
        ecr: await ethericCrystals.totalSupply(),
        enrg: await ethericEnergy.totalSupply()
      },
      deployTimestamp: await somGame.deployTimestamp(),
      chests: await somTokens.balanceOf(address, 1),
      items: theItems
    });
  } else {
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
