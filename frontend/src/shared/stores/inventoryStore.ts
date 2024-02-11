import {writable} from "svelte/store";

interface InventoryStore {
  ees: bigint;
  ecr: bigint;
  enrg: bigint;
  approvals: {
    items: boolean;
    ecr: bigint;
    enrg: bigint;
  };
  total: {
    ees: bigint;
    ecr: bigint;
    enrg: bigint;
  };
  deployTimestamp: number;
  chests: bigint;
  items: Array<{
    id: bigint;
    balance: bigint;
  }>;
}

const inventoryStore = writable<InventoryStore>({
  ees: 0n,
  ecr: 0n,
  enrg: 0n,
  approvals: {
    items: false,
    ecr: 0n,
    enrg: 0n
  },
  total: {
    ees: 0n,
    ecr: 0n,
    enrg: 0n
  },
  deployTimestamp: 0,
  chests: 0n,
  items: []
});

export {inventoryStore};
