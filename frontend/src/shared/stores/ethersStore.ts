import type { BrowserProvider, Contract, JsonRpcSigner } from "ethers";
import { writable } from "svelte/store";

interface EthersStore {
  provider: BrowserProvider;
  signer: JsonRpcSigner | undefined;
  chainId: bigint;
  contracts: {
    ethericEssence: Contract;
    ethericCrystals: Contract;
    ethericEnergy: Contract;
    somTokens: Contract;
    somGame: Contract;
  };
  isValid: boolean;
}

const ethersStore = writable<EthersStore>({
  provider: {} as BrowserProvider,
  signer: undefined,
  chainId: 0n,
  contracts: {
    ethericEssence: {} as Contract,
    ethericCrystals: {} as Contract,
    ethericEnergy: {} as Contract,
    somTokens: {} as Contract,
    somGame: {} as Contract
  },
  isValid: false,
});

export {ethersStore};
