import type {LobbyPlayer} from "../../mongo/index.js";

interface LobbyView {
  id: number;
  host: LobbyPlayer;
  challengee: LobbyPlayer | undefined;
}

export type {LobbyView};
