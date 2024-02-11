import {GameView, LobbyView, PlayerView} from "../../views/index.js";

interface Signin {
  playerView: PlayerView;
  gameView: GameView | undefined;
  lobbyView: LobbyView | undefined;
  token: string | undefined;
}

export type {Signin};
