import type { PlayerGamesTotal } from "./PlayerGamesTotal.js";
interface PlayerGames {
    casual: PlayerGamesTotal;
    ranked: PlayerGamesTotal;
    custom: PlayerGamesTotal;
}
export type { PlayerGames };
