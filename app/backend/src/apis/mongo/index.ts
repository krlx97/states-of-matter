import {MongoClient, type Document} from "mongodb";
import settings from "settings";
import type {Game} from "models/game";
import type {Player} from "@som/shared/types/mongo";
import type {CasualQueuePlayers} from "./casual-queue-players-db/casual-queue-players-db.types";
import type {Chat} from "./chats-db/chats-db.models";
import type {Lobby} from "./lobbies-db/lobbies-db.models";

const {
  mongo: {uri}
} = settings;

interface RankedQueuePlayers extends Document {
  username: string;
  elo: number;
}

const mongoClient = await MongoClient.connect(uri);
const mongoDb = mongoClient.db("som");

const casualQueuePlayersDb = mongoDb.collection<CasualQueuePlayers>("casualQueuePlayers");
const rankedQueuePlayersDb = mongoDb.collection<RankedQueuePlayers>("rankedQueuePlayers");
const chatsDb = mongoDb.collection<Chat>("chats");
const gamesDb = mongoDb.collection<Game>("games");
const lobbiesDb = mongoDb.collection<Lobby>("lobbies");
const playersDb = mongoDb.collection<Player>("players");

export {casualQueuePlayersDb, rankedQueuePlayersDb, chatsDb, gamesDb, lobbiesDb, playersDb};
