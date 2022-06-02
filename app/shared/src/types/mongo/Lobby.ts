import type {Document} from "mongodb";

export interface LobbyPlayer {
  username: string;
  socketId: string;
  avatarId: number;
}

export interface Lobby extends Document {
  lobbyId: number;
  host: LobbyPlayer;
  challengee: LobbyPlayer;
}
