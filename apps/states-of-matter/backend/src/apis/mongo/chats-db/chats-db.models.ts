import type {Document} from "mongodb";

interface ChatMessage {
  sender: string;
  date: Date;
  text: string;
}

interface Chat extends Document {
  players: [string, string];
  messages: ChatMessage[];
}

export type {Chat, ChatMessage};
