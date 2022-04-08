import type {Document} from "mongodb";

interface GameCard {
  id: number;
  klass: number;
  type: number;
  effects: Array<number>;
}

interface GameHero extends GameCard {
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
}

export interface GameMagic extends GameCard {
  gid: number;
  manaCost: number;
}

export interface GameMinion extends GameCard {
  gid: number;
  damage: number;
  health: number;
  maxHealth: number;
  manaCost: number;
  hasAttacked: boolean;
  hasTriggeredEffect: boolean;
}

export interface GameTrap extends GameCard {
  gid: number;
  manaCost: number;
}

export type GameCards = Array<GameMagic & GameMinion & GameTrap>;

interface GamePlayer {
  username: string;
  hero: GameHero;
  minion: {
    a: GameMinion | undefined;
    b: GameMinion | undefined;
    c: GameMinion | undefined;
    d: GameMinion | undefined;
  };
  trap: GameTrap | undefined;
  hand: GameCards;
  deck: GameCards;
  graveyard: GameCards;
}

export interface Game extends Document {
  gameId: number;
  currentPlayer: string;
  playerA: GamePlayer;
  playerB: GamePlayer;
}
