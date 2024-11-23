import {writable} from "svelte/store";
import {contractAddress} from "@som/shared/data";
import {Contract} from "ethers";

import Collectibles from "@som/contracts/Collectibles/artifacts/Collectibles.json" assert {
  type: "json"
};
import EthericCrystals from "@som/contracts/EthericCrystals/artifacts/EthericCrystals.json" assert {
  type: "json"
};
import EthericEnergy from "@som/contracts/EthericEnergy/artifacts/EthericEnergy.json" assert {
  type: "json"
};
import Game from "@som/contracts/Game/artifacts/Game.json" assert {
  type: "json"
};

interface EthersStore {
  accounts: Array<string>;
  chainId: bigint;
  isLoaded: boolean;
  contracts: {
    collectibles: any;
    ethericCrystals: any;
    ethericEnergy: any;
    game: any;
  };
}

const ethersStore = writable<EthersStore>({
  accounts: [],
  chainId: 0n,
  isLoaded: false,
  contracts: {
    collectibles: undefined,
    ethericCrystals: undefined,
    ethericEnergy: undefined,
    game: undefined
  }
});

export {ethersStore};
