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
  ethericEssence: "0xd00beff17b23C7e4141D31bbc293bF289D639Bba",
  ethericCrystals: "0xFFb2D5E4Dc49C0d87425c7E0902C4cf2F8Dc0c0a",
  ethericEnergy: "0x753Fc3e1c6dde746EB32385D33Fa4f9b43e41832",
  somTokens: "0x1a0171E24D2a1e5487a8b5e40391694C187Be46C",
  somGame: "0x8Bbc4e54Eb45E58C400678B03E8A098da64793ED"
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
