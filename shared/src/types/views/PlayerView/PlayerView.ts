import type {PlayerDeckView} from "./PlayerDeckView.js";
import type {PlayerSocialView} from "./PlayerSocialView.js";

import type {
  PlayerGames,
  PlayerSkins,
  PlayerTutorial,
  PlayerQuests,
  PlayerRewards
} from "../../mongo/index.js";

import type {PlayerStatus, QueueId} from "../../../enums/index.js";

interface PlayerView {
  name: string;
  address: string;
  nonce: number;
  avatarId: number;
  bannerId: number;
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
  social: PlayerSocialView;
  games: PlayerGames;
  decks: Array<PlayerDeckView>;
  skins: PlayerSkins;
  tutorial: PlayerTutorial;
  tasks: PlayerQuests;
  rewards: PlayerRewards;
}

export type {PlayerView};
