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
  ethericEssence: "0x98c9D1e1e9e6Ee021B8288902f4D24A693DeB986",
  ethericCrystals: "0xdB5D0309028e06aFc743f1A83fC4653DB8DAA5B8",
  ethericEnergy: "0x4Ca02e48bC26707b83F2c14D11D838cc64C04Ba6",
  somTokens: "0x27Eb2894A475a533c8AAA3268b521aC47f99cbC7",
  somGame: "0x20625c87228573EA374e02844782ec3a1a0497ce"
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
