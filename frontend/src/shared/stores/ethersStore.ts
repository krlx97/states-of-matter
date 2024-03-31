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
    collectibles: Contract;
    ethericCrystals: Contract;
    ethericEnergy: Contract;
    game: Contract;
  };
}

const ethersStore = writable<EthersStore>({
  accounts: [],
  chainId: 0n,
  isLoaded: false,
  contracts: {
    collectibles: new Contract(contractAddress.collectibles, Collectibles.abi),
    ethericCrystals: new Contract(contractAddress.ethericCrystals, EthericCrystals.abi),
    ethericEnergy: new Contract(contractAddress.ethericEnergy, EthericEnergy.abi),
    game: new Contract(contractAddress.game, Game.abi)
  }
});

export {ethersStore};
