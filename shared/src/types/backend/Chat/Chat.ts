import type {Document} from "mongodb";
import type {ChatMessage} from "./ChatMessage.js";

interface Chat extends Document {
  players: [string, string];
  messages: Array<ChatMessage>;
}

export type {Chat};
