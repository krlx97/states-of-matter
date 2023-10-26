import type {PlayerDeckView} from "./PlayerDeckView.js";

import type {
  PlayerGames,
  PlayerSkin,
  PlayerTutorial
} from "../../mongo/index.js";

import type {PlayerStatus, QueueId} from "../../../enums/index.js";

interface PlayerView {
  name: string;
  experience: number;
  level: number;
  elo: number;
  joinedAt: number;
  status: PlayerStatus;
  queueId: QueueId;
  lobbyId: number;
  gamePopupId: number;
  gameId: number;
  deckId: number;
  games: PlayerGames;
  decks: Array<PlayerDeckView>;
  skins: Array<PlayerSkin>;
  tutorial: PlayerTutorial;
}

export type {PlayerView};
