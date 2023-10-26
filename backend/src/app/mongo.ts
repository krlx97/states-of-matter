import {MongoClient} from "mongodb";

import type {
  Account,
  CasualQueuePlayer,
  Chat,
  Game,
  GamePopup,
  Lobby,
  MarketItem,
  Player,
  RankedQueuePlayer
} from "@som/shared/types/mongo";

const mongoClient = await MongoClient.connect("mongodb://127.0.0.1:27017");
const eternitas = mongoClient.db("eternitas");
const som = mongoClient.db("som");

const mongo = {
  $accounts: eternitas.collection<Account>("accounts"),
  $chats: eternitas.collection<Chat>("chats"),
  $casualQueuePlayers: som.collection<CasualQueuePlayer>("casualQueuePlayers"),
  $games: som.collection<Game>("games"),
  $gamePopups: som.collection<GamePopup>("gamePopups"),
  $lobbies: som.collection<Lobby>("lobbies"),
  $marketItems: som.collection<MarketItem>("marketItems"),
  $players: som.collection<Player>("players"),
  $rankedQueuePlayers: som.collection<RankedQueuePlayer>("rankedQueuePlayers")
};

export {mongo};
