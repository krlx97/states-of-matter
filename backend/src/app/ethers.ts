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
  ethericEssence: "0xDeCD7574fa58b52Dc87dDDB3BD376228D54E78a1",
  ethericCrystals: "0xf811f1AB4bfE4f58a703a0E32654a7789e7A9469",
  ethericEnergy: "0x51d94d7F370DAD3971f54baAb4911acFedbCf984",
  somTokens: "0xdF735A6a29a85E144623F8c6197b11134d4C11ae",
  somGame: "0x3BDCc313b07cAeA90Fc5323749D13F086a4b62e0"
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
