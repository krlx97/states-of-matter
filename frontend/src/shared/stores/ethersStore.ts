import {writable} from "svelte/store";
import type {Contract} from "ethers";

interface EthersStore {
  accounts: Array<string>;
  chainId: bigint;
  isLoaded: boolean;
  contracts: {
    ethericEssence: Contract | undefined;
    ethericCrystals: Contract | undefined;
    ethericEnergy: Contract | undefined;
    somTokens: Contract | undefined;
    somGame: Contract | undefined;
  };
}

const ethersStore = writable<EthersStore>({
  accounts: [],
  chainId: 0n,
  isLoaded: false,
  contracts: {
    ethericEssence: undefined,
    ethericCrystals: undefined,
    ethericEnergy: undefined,
    somTokens: undefined,
    somGame: undefined
  }
});

export {ethersStore};
