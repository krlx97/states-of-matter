import type { Document } from "mongodb";
import type { LobbyPlayer } from "./LobbyPlayer.js";
import { ChatMessages } from "../Chat/ChatMessages.js";
interface Lobby extends Document {
    id: number;
    host: LobbyPlayer;
    challengee: LobbyPlayer | undefined;
    messages: ChatMessages;
}
export type { Lobby };
