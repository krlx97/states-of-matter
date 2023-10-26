import type {Document} from "mongodb";
import type {PlayerGames} from "./PlayerGames.js";
import type {PlayerTutorial} from "./PlayerTutorial.js";
import type {PlayerDeck} from "./PlayerDeck.js";
import type {PlayerSkin} from "./PlayerSkin.js";
import type {PlayerStatus, QueueId} from "../../../enums/index.js"

interface Player extends Document {
  name: string;
  experience: number;
  level: number;
  elo: number;
  joinedAt: number;
  status: PlayerStatus;
  socketId: string;
  queueId: QueueId;
  lobbyId: number;
  gamePopupId: number;
  gameId: number;
  deckId: number;
  games: PlayerGames;
  decks: Array<PlayerDeck>;
  skins: Array<PlayerSkin>;
  tutorial: PlayerTutorial;
}

export type {Player};
