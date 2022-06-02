import type {Document} from "mongodb";

interface Game extends Document {
  gameId: number;
  type: "casual" | "ranked" | "custom";
  currentPlayer: string;
  currentTurn: number;
  playerA: GamePlayer;
  playerB: GamePlayer;
}

interface GameCard {
  id: number;
  gid: number;
  name: string;
  klass: number;
  type: number;
  manaCost: number;
  effects: number[];
}

type GameCards = Array<GameMagic | GameMinion | GameTrap>;

interface GameHero {
  name: string;
  klass: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  effects: number[];
}

interface GameMagic extends GameCard {}

interface GameMinion extends GameCard {
  damage: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
  hasTriggeredEffect: boolean;
}

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

interface GameTrap extends GameCard {}

export type {
  Game,
  GameCard,
  GameCards,
  GameHero,
  GameMagic,
  GameMinion,
  GamePlayer,
  GameTrap
};
