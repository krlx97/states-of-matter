import {MongoClient} from "mongodb";

import type {
  CasualQueuePlayer,
  Chat,
  Game,
  GamePopup,
  Lobby,
  Player,
  RankedQueuePlayer
} from "@som/shared/types/mongo";

const client = await MongoClient.connect("mongodb://127.0.0.1:27017");
const som = client.db("som");

const mongo = {
  $chats: som.collection<Chat>("chats"),
  $casualQueuePlayers: som.collection<CasualQueuePlayer>("casualQueuePlayers"),
  $games: som.collection<Game>("games"),
  $gamePopups: som.collection<GamePopup>("gamePopups"),
  $lobbies: som.collection<Lobby>("lobbies"),
  $players: som.collection<Player>("players"),
  $rankedQueuePlayers: som.collection<RankedQueuePlayer>("rankedQueuePlayers"),
  $supplySnapshots: som.collection<any>("supplySnapshots"),
  $leaderboards: som.collection<any>("leaderboards"),
};

export {mongo};
