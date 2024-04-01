import {Contract, JsonRpcProvider, Wallet} from "ethers";
import {contractAddress} from "@som/shared/data";
import {settings} from "./settings.js";

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

const provider = new JsonRpcProvider("https://testnet.telos.net/evm");
const signer = new Wallet(settings.key, provider);

const contracts = {
  collectibles: new Contract(contractAddress.collectibles, Collectibles.abi, signer),
  ethericCrystals: new Contract(contractAddress.ethericCrystals, EthericCrystals.abi, signer),
  ethericEnergy: new Contract(contractAddress.ethericEnergy, EthericEnergy.abi, signer),
  game: new Contract(contractAddress.game, Game.abi, signer)
};

export {contracts};
