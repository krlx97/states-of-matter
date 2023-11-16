import {
  AccountView,
  GameView,
  LobbyView,
  PlayerView
} from "../../views/index.js";

interface Signin {
  accountView: AccountView;
  gameView: GameView | undefined;
  lobbyView: LobbyView | undefined;
  playerView: PlayerView;
}

export type {Signin};
