import type {Document} from "mongodb";

interface Message {
  sender: string;
  date: Date;
  text: string;
}

type ChatPlayers = [string, string];

interface Chat extends Document {
  players: ChatPlayers;
  messages: Message[];
}

export {Message, ChatPlayers, Chat};
