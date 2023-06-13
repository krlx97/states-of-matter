import type { GameLogs } from "../../backend/Game/index.js";
import type { GameType } from "../../../enums/index.js";
import type { GamePlayerView } from "./GamePlayerView.js";
import type { GameOpponentView } from "./GameOpponentView.js";
interface GameView {
    id: number;
    type: GameType;
    currentPlayer: string;
    currentTurn: number;
    gameLogs: GameLogs;
    player: GamePlayerView;
    opponent: GameOpponentView;
}
export type { GameView };
