import type { PlayerGames } from "../../mongo/Player/PlayerGames.js";

interface UpdateFriend {
  name: string;
  avatarId?: number;
  bannerId?: number;
  experience?: number;
  level?: number;
  elo?: number;
  status?: number;
  games?: PlayerGames;
}

export type {UpdateFriend};
