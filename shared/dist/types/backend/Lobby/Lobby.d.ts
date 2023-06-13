import type { Document } from "mongodb";
import type { LobbyPlayer } from "./LobbyPlayer.js";
interface Lobby extends Document {
    id: number;
    host: LobbyPlayer;
    challengee: LobbyPlayer;
}
export type { Lobby };
