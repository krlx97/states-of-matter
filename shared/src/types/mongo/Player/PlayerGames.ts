import type {PlayerGamesTotal} from "./PlayerGamesTotal.js";

interface PlayerGames {
  casual: PlayerGamesTotal;
  ranked: PlayerGamesTotal;
}

export type {PlayerGames};
