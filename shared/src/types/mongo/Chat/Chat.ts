import type {Document} from "mongodb";
import type {ChatMessages} from "./ChatMessages.js";

interface Chat extends Document {
  players: [string, string];
  lastSender: string;
  unseen: number;
  messages: ChatMessages;
}

export type {Chat};
