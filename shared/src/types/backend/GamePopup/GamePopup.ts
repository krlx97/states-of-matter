import type {Document} from "mongodb";
import type {GameType} from "../../../enums/index.js";
import type {GamePopupPlayer} from "./GamePopupPlayer.js";

interface GamePopup extends Document {
  id: number;
  type: GameType;
  playerA: GamePopupPlayer;
  playerB: GamePopupPlayer;
}

export type {GamePopup};
