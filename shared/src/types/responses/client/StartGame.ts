import type {GameView} from "../../views/index.js";

interface StartGamePlayer {
  name: string;
  avatarId: number;
  level: number;
  elo: number;
}

interface StartGame {
  playerA: StartGamePlayer;
  playerB: StartGamePlayer;
  game: GameView;
}

export type {StartGame};
