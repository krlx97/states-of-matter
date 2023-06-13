import type {GameCards} from "./GameCards.js";
import type {GameHeroCard} from "./GameHeroCard.js";
import type {GameMinionCard} from "./GameMinionCard.js";
import type {GameTrapCard} from "./GameTrapCard.js";
import type {PlayerSkins} from "../Player/PlayerSkins.js";

interface GamePlayer {
  name: string;
  hero: GameHeroCard;
  minion: {
    a: GameMinionCard | undefined;
    b: GameMinionCard | undefined;
    c: GameMinionCard | undefined;
    d: GameMinionCard | undefined;
  };
  trap: GameTrapCard | undefined;
  hand: GameCards;
  deck: GameCards;
  graveyard: GameCards;
  skins: PlayerSkins;
}

export type {GamePlayer};
