import type {LobbyPlayer} from "../../../types/mongo/index.js";

interface JoinLobbyReceiver {
  challengee: LobbyPlayer;
}

export type {JoinLobbyReceiver};
