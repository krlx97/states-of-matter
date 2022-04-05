import type {Document} from "mongodb";

export interface ChatMessage {
  sender: string;
  date: Date;
  text: string;
}

export type ChatMessages = Array<ChatMessage>;
export type ChatPlayers = [string, string];

export interface Chat extends Document {
  players: ChatPlayers;
  messages: ChatMessages;
}
