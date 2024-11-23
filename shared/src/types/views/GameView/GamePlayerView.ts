import type {
  GameHeroCard,
  GameMagicCard,
  GameMinionCard,
  GameTrapCard,
  PlayerSkin
} from "../../mongo/index.js";

type CardList = Array<GameMagicCard|
GameMinionCard|
GameTrapCard>;

interface GamePlayerView {
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
  deck: number;
  graveyard: CardList;
  skins: Array<PlayerSkin>;
}

export type {GamePlayerView};
