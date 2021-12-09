import type {Document} from "mongodb";

interface Hero {
  id: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  passive: number;
}

interface Card {
  id: number;
  gid: number;
}

interface Fields {
  magic: Card;
  minionA: Card;
  minionB: Card;
  minionC: Card;
  minionD: Card;
  trap: Card;
}

interface Player {
  username: string;
  hero: Hero;
  fields: Fields;
  deck: Array<Card>;
  hand: Array<Card>;
  graveyard: Array<Card>;
}

interface Game extends Document {
  id: number;
  playerA: Player;
  playerB: Player;
}

export type {Game};
