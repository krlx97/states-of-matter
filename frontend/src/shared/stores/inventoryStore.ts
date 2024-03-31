import {writable} from "svelte/store";

interface InventoryStoreToken {
  balance: bigint;
  totalSupply: bigint;
  allowance: bigint;
}

interface Common {
  id: bigint;
  name: string;
  type: number; // ItemType;
  rarity: 0; // ItemRarity;
  owned: boolean;
}

interface Other {
  id: bigint;
  name: string;
  type: number; // ItemType;
  rarity: 1 | 2 | 3 | 4; // ItemRarity;
  balance: bigint;
  shards: bigint;
}

type InventoryStoreItems = Array<Common | Other>;

interface InventoryStore {
  ecr: InventoryStoreToken;
  enrg: InventoryStoreToken;
  collectibles: {
    approved: boolean;
    shardPacks: bigint;
    items: InventoryStoreItems;
  };
  deployTimestamp: bigint;
}

const inventoryStore = writable<InventoryStore>({
  ecr: {
    balance: 0n,
    totalSupply: 0n,
    allowance: 0n
  },
  enrg: {
    balance: 0n,
    totalSupply: 0n,
    allowance: 0n
  },
  collectibles: {
    approved: false,
    shardPacks: 0n,
    items: [],
  },
  deployTimestamp: 0n
});

export {inventoryStore};
