import type {Document} from "mongodb";

interface LobbyPlayer {
  username: string;
  avatarId: number;
}

interface Lobby extends Document {
  lobbyId: number;
  host: LobbyPlayer;
  challengee: LobbyPlayer;
}

export type {LobbyPlayer, Lobby};
