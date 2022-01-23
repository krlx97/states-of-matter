import MongoService from "../MongoService.js";
import type {Collection, DeleteResult, Filter, InsertOneResult, UpdateResult} from "mongodb";
import type {Message, ChatPlayers, Chat} from "./ChatService.models";

class ChatService extends MongoService<Chat> {
  public async pushChatMsg(players: [string, string], msg: Message): Promise<boolean> {
    const {sender, text, date} = msg;
    let updated!: UpdateResult;

    try {
      updated = await this._apis.mongo.collection("chats").updateOne({
        players: {$all: players}
      }, {
        $push: {
          messages: {sender, text, date}
        }
      });
    } catch (error) {
      this._handleError(error);
    }

    return updated.modifiedCount > 0 ? true : false;
  }
}

export default ChatService;
