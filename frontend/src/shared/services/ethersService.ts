import {get} from "svelte/store";
import {BrowserProvider, JsonRpcProvider, JsonRpcSigner} from "ethers";
import {items, contractAddress} from "@som/shared/data";
import {playerStore, ethersStore, inventoryStore} from "stores";

const init = (address: string): void => {
  if (window.ethereum) {
    let provider = new BrowserProvider(window.ethereum);
    let signer: JsonRpcSigner | undefined;

    if (address.length) {
      signer = new JsonRpcSigner(provider, address);
    }

    ethersStore.update((store) => {
      const runner = signer ? signer : provider;
      const contractsKeys = Object.keys(store.contracts) as Array<keyof typeof store.contracts>;

      for (const key of contractsKeys) {
        store.contracts[key] = store.contracts[key].connect(runner);
      }

      return store;
    });
  } else {
    const provider = new JsonRpcProvider("https://testnet.telos.net/evm");

    ethersStore.update((store) => {
      const contractsKeys = Object.keys(store.contracts) as Array<keyof typeof store.contracts>;

      for (const key of contractsKeys) {
        store.contracts[key] = store.contracts[key].connect(provider);
      }

      return store;
    });
  }
};

const transact = async (
  address: keyof typeof contractAddress,
  action: string,
  params: Array<string | bigint | boolean>
): Promise<boolean> => {
  const $ethersStore = get(ethersStore);
  const contract = $ethersStore.contracts[address];
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
  if (!window.ethereum) { return; }
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
    collectibles,
    ethericCrystals,
    ethericEnergy,
    game
  } = get(ethersStore).contracts;

  const $ethersStore = get(ethersStore);
  const {address, elo} = get(playerStore);

  if ($ethersStore.chainId !== 41n) {
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

    const shardIds = itemIds.map((id): bigint => id * 10n);
    const query = itemIds.map((): string => address);

    const [
      bal,
      srd,
      collectiblesApproval,
      shardPacks,
      ecrBalance,
      ecrSupply,
      ecrAllowance,
      enrgBalance,
      enrgSupply,
      enrgAllowance,
      deployTimestamp
    ] = await Promise.all([
      collectibles.balanceOfBatch(query, itemIds),
      collectibles.balanceOfBatch(query, shardIds),
      collectibles.isApprovedForAll(address, contractAddress.game),
      collectibles.balanceOf(address, 1),
      ethericCrystals.balanceOf(address),
      ethericCrystals.totalSupply(),
      ethericCrystals.allowance(address, contractAddress.game),
      ethericEnergy.balanceOf(address),
      ethericEnergy.totalSupply(),
      ethericEnergy.allowance(address, contractAddress.game),
      game.deployTimestamp(),
    ]);

    const stats: Array<{id: bigint, balance: bigint, shards: bigint}> = [];

    itemIds.forEach((id, i) => {
      stats.push({
        id,
        balance: bal[i],
        shards: srd[i]
      });
    });

    for (const item of items) {
      const {rarity, name, type} = item;
      const id = BigInt(item.id)

      if (rarity === 0) {
        let owned = true;

        if (id === 101n || id === 201n) { // silver
          owned = elo >= 600 ? true : false;
        } else if (id === 102n || id === 202n) { // gold
          owned = elo >= 800 ? true : false;
        } else if (id === 103n || id === 203n) { // master
          owned = elo >= 1000 ? true : false;
        }

        theItems.push({id, name, type, rarity, owned});
      } else {
        const stat = stats.find((b): boolean => b.id === id);
        let balance = 0n;
        let shards = 0n;

        if (stat) {
          balance = stat.balance;
          shards = stat.shards;
        }

        theItems.push({id, name, type, rarity, balance, shards});
      }
    }

    inventoryStore.set({
      ecr: {
        balance: ecrBalance,
        totalSupply: ecrSupply,
        allowance: ecrAllowance
      },
      enrg: {
        balance: enrgBalance,
        totalSupply: enrgSupply,
        allowance: enrgAllowance
      },
      collectibles: {
        approved: collectiblesApproval,
        shardPacks,
        items: theItems
      },
      deployTimestamp
    });
  } else {
    const theItems = [];
    const [ecrSupply, enrgSupply, deployTimestamp] = await Promise.all([
      ethericCrystals.totalSupply(),
      ethericEnergy.totalSupply(),
      game.deployTimestamp()
    ]);

    for (const item of items) {
      const {rarity, name, type} = item;
      const id = BigInt(item.id);

      if (rarity === 0) {
        let owned = true;

        if (id === 101n || id === 201n) { // silver
          owned = elo >= 600 ? true : false;
        } else if (id === 102n || id === 202n) { // gold
          owned = elo >= 800 ? true : false;
        } else if (id === 103n || id === 203n) { // master
          owned = elo >= 1000 ? true : false;
        }

        theItems.push({id, name, type, rarity, owned});
      } else {
        const balance = 0n;
        const shards = 0n;
        theItems.push({id, name, type, rarity, balance, shards});
      }
    }

    inventoryStore.set({
      ecr: {
        balance: 0n,
        totalSupply: ecrSupply,
        allowance: 0n
      },
      enrg: {
        balance: 0n,
        totalSupply: enrgSupply,
        allowance: 0n
      },
      collectibles: {
        approved: false,
        shardPacks: 0n,
        items: theItems
      },
      deployTimestamp
    });
  }

  ethersStore.update((store) => {
    store.isLoaded = true;
    return store;
  });
};

const ethersService = {keys: contractAddress, init, transact, sign, reloadUser};

export {ethersService};
