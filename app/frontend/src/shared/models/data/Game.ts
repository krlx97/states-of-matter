interface GameHero {
  id: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  damage: number;
  passive: number;
}

interface GameCard {
  gid: number;
  id: number;
  klass: number;
  type: number;
  damage?: number;
  health?: number;
  maxHealth?: number;
  manaCost: number;
}

interface GameFields {
  magic: undefined | GameCard;
  minionA: undefined | GameCard;
  minionB: undefined | GameCard;
  minionC: undefined | GameCard;
  minionD: undefined | GameCard;
  minionE: undefined | GameCard;
  minionF: undefined | GameCard;
  trap: undefined | GameCard;
}

interface GamePlayer {
  username: string;
  hero: GameHero;
  fields: GameFields;
  deck: Array<GameCard>;
  hand: Array<GameCard>;
  graveyard: Array<GameCard>;
}

interface GameOpponent {
  username: string;
  hero: GameHero;
  fields: GameFields;
  deck: number;
  hand: number;
  graveyard: Array<GameCard>;
}

interface Game {
  gameId: number;
  currentPlayer: string;
  player: GamePlayer;
  opponent: GameOpponent;
}

export type {Game};
