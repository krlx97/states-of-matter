import type {Document} from "mongodb";

interface GamePlayerHero {
  id: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  damage: number;
  passive: number;
}

interface GamePlayerFields {
  magic: undefined | GamePlayerCard;
  minionA: undefined | GamePlayerCard;
  minionB: undefined | GamePlayerCard;
  minionC: undefined | GamePlayerCard;
  minionD: undefined | GamePlayerCard;
  trap: undefined | GamePlayerCard;
}

interface GamePlayerCard {
  gid: number;
  id: number;
  klass: number;
  type: number;
  damage?: number;
  health?: number;
  maxHealth?: number;
  manaCost: number;
}

interface GamePlayer {
  username: string;
  hero: GamePlayerHero;
  fields: GamePlayerFields;
  deck: Array<GamePlayerCard>;
  hand: Array<GamePlayerCard>;
  graveyard: Array<GamePlayerCard>;
}

interface Game extends Document {
  gameId: number;
  currentPlayer: string;
  playerA: GamePlayer;
  playerB: GamePlayer;
}

export type {
  GamePlayerHero,
  GamePlayerFields,
  GamePlayerCard,
  GamePlayer,
  Game
};
