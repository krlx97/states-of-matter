import {ethers} from "ethers";
import SomGame from "@som/contracts/SomGame/artifacts/SomGame.json" assert {type: "json"};
import SomSkins from "@som/contracts/SomSkins/artifacts/SomSkins.json" assert {type: "json"};

const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
const signer = new ethers.Wallet("0x36558f992d19662cdea021407513e14f83f47917ba0a28fd879ff148afd0edd2", provider);

const gameKey = "0xA1584c8E3e572101D0D28A9ebb1784Af9f0fBCd4";
const skinsKey = "0x759F6751A243cc8EacC959bd10A910831A670720";

const game = new ethers.Contract(gameKey, SomGame.abi, signer);
const skins = new ethers.Contract(skinsKey, SomSkins.abi, signer);

const contracts = {game, skins};

export {contracts};
