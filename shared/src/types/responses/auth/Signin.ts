import {
  AccountView,
  GameView,
  LobbyView,
  PlayerView
} from "../../views/index.js";

interface Signin {
  accountFrontend: AccountView;
  playerFrontend: PlayerView;
  lobbyFrontend: LobbyView | undefined;
  gameFrontend: GameView | undefined;
}

export type {Signin};
