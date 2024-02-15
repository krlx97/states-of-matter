import type { GameCards, GameHeroCard, GameMinionCard, PlayerSkin } from "../../mongo/index.js";
interface GameOpponentView {
    name: string;
    field: {
        hero: GameHeroCard;
        a: GameMinionCard | undefined;
        b: GameMinionCard | undefined;
        c: GameMinionCard | undefined;
        d: GameMinionCard | undefined;
    };
    trap: boolean;
    deck: number;
    hand: number;
    graveyard: GameCards;
    skins: Array<PlayerSkin>;
}
export type { GameOpponentView };
