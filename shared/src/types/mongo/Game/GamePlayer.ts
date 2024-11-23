import type {GameHeroCard} from "./GameHeroCard.js";
import type {GameMinionCard} from "./GameMinionCard.js";
import type {GameTrapCard} from "./GameTrapCard.js";
import type {PlayerSkin} from "../Player/index.js";
import type {GameMagicCard} from "./GameMagicCard.js";

type CardList = Array<GameMagicCard | GameMinionCard | GameTrapCard>;

interface GamePlayer {
  name: string;
  field: {
    hero: GameHeroCard;
    a: GameMinionCard | undefined;
    b: GameMinionCard | undefined;
    c: GameMinionCard | undefined;
    d: GameMinionCard | undefined;
  };
  trap: GameTrapCard | undefined;
  hand: CardList;
  deck: CardList;
  graveyard: CardList;
  skins: Array<PlayerSkin>;
}

export type {GamePlayer};
