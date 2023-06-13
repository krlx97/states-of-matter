import type {PlayerSkins} from "../../backend/Player/index.js";
import type {GameCards, GameHeroCard, GameMinionCard, GameTrapCard} from "../../backend/Game/index.js";

interface GameOpponentView {
  name: string;
  hero: GameHeroCard;
  minion: {
    a: GameMinionCard | undefined;
    b: GameMinionCard | undefined;
    c: GameMinionCard | undefined;
    d: GameMinionCard | undefined;
  };
  trap: boolean;
  deck: number;
  hand: number;
  graveyard: GameCards;
  skins: PlayerSkins;
}

export type {GameOpponentView};
