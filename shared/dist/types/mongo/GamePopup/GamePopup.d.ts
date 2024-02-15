import type { Document } from "mongodb";
import type { GamePopupPlayer } from "./GamePopupPlayer.js";
import type { GameType } from "../../../enums/index.js";
interface GamePopup extends Document {
    id: number;
    type: GameType;
    playerA: GamePopupPlayer;
    playerB: GamePopupPlayer;
}
export type { GamePopup };
