import type { GameType } from "../../../enums/index.js";
interface GameEnded {
    isWinner: boolean;
    gameType: GameType;
    experience: number;
    elo: number;
}
export type { GameEnded };
