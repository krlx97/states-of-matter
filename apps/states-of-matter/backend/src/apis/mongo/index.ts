import {MongoClient, type Document} from "mongodb";
import settings from "settings";
import type {Game} from "models/game";
import type {Player} from "models/Player";
import type {CasualQueuePlayers} from "./casual-queue-players-db/casual-queue-players-db.types";
import type {Chat} from "./chats-db/chats-db.models";
import type {Account} from "models/Account";
import type {Lobby} from "models/Lobby";

const {
  mongo: {uri}
} = settings;

interface RankedQueuePlayers extends Document {
  username: string;
  elo: number;
}

const mongoClient = await MongoClient.connect(uri);
const eternitasDb = mongoClient.db("eternitas");
const mongoDb = mongoClient.db("som");

const accountsDb = eternitasDb.collection<Account>("accounts");
const chatsDb = eternitasDb.collection<Chat>("chats");

const casualQueuePlayersDb = mongoDb.collection<CasualQueuePlayers>("casualQueuePlayers");
const rankedQueuePlayersDb = mongoDb.collection<RankedQueuePlayers>("rankedQueuePlayers");
const gamesDb = mongoDb.collection<Game>("games");
const preGamesDb = mongoDb.collection<any>("preGames");
const lobbiesDb = mongoDb.collection<Lobby>("lobbies");
const playersDb = mongoDb.collection<Player>("players");

const db = {
  accounts: eternitasDb.collection<Account>("accounts")
}

export {
  accountsDb,
  casualQueuePlayersDb,
  rankedQueuePlayersDb,
  chatsDb,
  preGamesDb,
  gamesDb,
  lobbiesDb,
  playersDb
};
