import type { Document } from "mongodb";
import type { GameLogs } from "./GameLogs.js";
import type { GamePlayer } from "./GamePlayer.js";
import type { GameType } from "../../../enums/index.js";
interface Game extends Document {
    id: number;
    type: GameType;
    currentPlayer: string;
    currentTurn: number;
    gameLogs: GameLogs;
    playerA: GamePlayer;
    playerB: GamePlayer;
}
export type { Game };
