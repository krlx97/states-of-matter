import {Wallet, Contract, JsonRpcProvider} from "ethers";

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

const provider = new JsonRpcProvider(
  "https://testnet.telos.net/evm"
  // "http://localhost:8545"
);
const signer = new Wallet("0xc5ebf1171e9f76c728795be3fb75620e9e7888404e461099f6b4b916283b540b", provider);

const keys = {
  ethericEssence: "0xD2c7143A714573f767a9E8acF64315a6Ef418231",
  ethericCrystals: "0xd393F4A7a9b2937fb8cb30Ae3e03866755c37Ba3",
  ethericEnergy: "0xa151F99db0d89B9d1D568e56fcE5d7ac84355A5E",
  somTokens: "0xA857C3e9770dC18ee6a022691cAA62f3Afa777E1",
  somGame: "0x1dfF35052F1FE01EdB2d767D9e8F644B9c271108"
};

const ethericEssence = new Contract(keys.ethericEssence, EthericEssence.abi, signer);
const ethericCrystals = new Contract(keys.ethericCrystals, EthericCrystals.abi, signer);
const ethericEnergy = new Contract(keys.ethericEnergy, EthericEnergy.abi, signer);
const somTokens = new Contract(keys.somTokens, SomTokens.abi, signer);
const somGame = new Contract(keys.somGame, SomGame.abi, signer);

const contracts = {
  ethericEssence,
  ethericCrystals,
  ethericEnergy,
  somTokens,
  somGame
};

export {contracts};
