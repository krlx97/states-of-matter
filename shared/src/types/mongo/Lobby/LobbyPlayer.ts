import type {PlayerGames} from "../index.js";

interface LobbyPlayer {
  name: string;
  experience: number;
  level: number;
  elo: number;
  avatarId: number;
  bannerId: number;
  games: PlayerGames;
}

export type {LobbyPlayer};
