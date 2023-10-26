import type {
  GameCards,
  GameHeroCard,
  GameMinionCard,
  GameTrapCard,
  PlayerSkin
} from "../../mongo/index.js";

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
  hand: GameCards;
  deck: number;
  graveyard: GameCards;
  skins: Array<PlayerSkin>;
}

export type {GamePlayerView};
