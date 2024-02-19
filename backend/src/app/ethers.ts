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

const provider = new JsonRpcProvider("https://testnet.telos.net/evm");
const signer = new Wallet("0xc5ebf1171e9f76c728795be3fb75620e9e7888404e461099f6b4b916283b540b", provider);

const keys = {
  ethericEssence: "0xba69ddE1586be3Ab4E101C13f8f9d730082b5BE0",
  ethericCrystals: "0x5ef70Dd1B3D4BA9D2509C665E63A0aDCbF3EA259",
  ethericEnergy: "0x4cd0B057577770a5699Be8fefd399035be894F3d",
  somTokens: "0xD0A76288A6b84059FAf5218AC2420251c6C5b5f8",
  somGame: "0x90Acf3677114443AF72798a558d5bb56278eb743"
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
