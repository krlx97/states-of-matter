import type {GameOpponentView} from "./GameOpponentView.js";
import type {GamePlayerView} from "./GamePlayerView.js";
import type {GameLogs} from "../../mongo/Game/index.js";
import type {GameType} from "../../../enums/index.js";

interface GameView {
  id: number;
  type: GameType;
  currentPlayer: string;
  currentTurn: number;
  gameLogs: GameLogs;
  player: GamePlayerView;
  opponent: GameOpponentView;
}

export type {GameView};
