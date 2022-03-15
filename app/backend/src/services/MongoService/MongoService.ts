import type {Collection, Db} from "mongodb";
import type {SocketIds, Usernames} from "./MongoService.types";
import type {Chat} from "./ChatService.models";
import type {Game} from "./GameService.models";
import type {Lobby} from "./LobbyService.models";
import type {Player} from "./PlayerService.models";

export class MongoService {
  public readonly $chats: Collection<Chat>;
  public readonly $games: Collection<Game>;
  public readonly $lobbies: Collection<Lobby>;
  public readonly $players: Collection<Player>;

  constructor (mongoDb: Db) {
    this.$chats = mongoDb.collection("chats");
    this.$games = mongoDb.collection("games");
    this.$lobbies = mongoDb.collection("lobbies");
    this.$players = mongoDb.collection("players");
  }

  public async getSocketIds (usernames: Usernames): Promise<SocketIds> {
    return await this
      .$players
      .find({username: {$in: usernames}})
      .project({_id: 0, socketId: 1})
      .map(({socketId}) => socketId)
      .toArray();
  }
}
