import type {Document} from "mongodb";

interface GameHero {
  id: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  effects: Array<number>;
}

interface GameCard {
  id: number;
  gid: number;
  klass: number;
  type: number;
  manaCost: number;
  effects: Array<number>;
}

export interface GameMagic extends GameCard {}

export interface GameMinion extends GameCard {
  damage: number;
  health: number;
  maxHealth: number;
  hasAttacked: boolean;
  hasTriggeredEffect: boolean;
}

export interface GameTrap extends GameCard {}

export type GameCards = Array<GameMagic & GameMinion & GameTrap>;

export interface GamePlayer {
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