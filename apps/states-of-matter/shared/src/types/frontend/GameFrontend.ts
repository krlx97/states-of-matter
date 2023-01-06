export interface GameHero {
  id: number;
  name: string;
  klass: number;
  type: number;
  health: number;
  mana: number;
  ability: number;
  maxHealth: number;
  maxMana: number;
}

interface GameCard {
  id: number;
  gid: number;
  name: string;
  klass: number;
  type: number;
  manaCost: number;
  effect: {
    id: number;
    type: number;
  };
  buffs: Array<number>;
  debuffs: Array<number>;
}

export interface GameMagic extends GameCard {}

export interface GameMinion extends GameCard {
  damage: number;
  health: number;
  maxHealth: number;
  canAttack: boolean;
  hasTriggeredEffect: boolean;
}

export interface GameTrap extends GameCard {}

export type GameCards = Array<GameMagic | GameMinion | GameTrap>;

interface GameFEPlayer {
  name: string;
  hero: GameHero;
  minion: {
    a: GameMinion | undefined;
    b: GameMinion | undefined;
    c: GameMinion | undefined;
    d: GameMinion | undefined;
  };
  trap: GameTrap | undefined;
  deck: GameCards;
  hand: GameCards;
  graveyard: GameCards;
}

interface GameFEOpponent {
  name: string;
  hero: GameHero;
  minion: {
    a: GameMinion | undefined;
    b: GameMinion | undefined;
    c: GameMinion | undefined;
    d: GameMinion | undefined;
  };
  trap: boolean;
  deck: number;
  hand: number;
  graveyard: GameCards;
}

enum LogType {ATTACK, SUMMON};

interface AttackLog {
  type: LogType.ATTACK;
  playerAtk: string;
  playerDef: string;
  with: number;
  target: number;
  attacked: string;
  attacker: string;
}
interface SummonLog {
  type: LogType.SUMMON;
  player: string;
  field: string;
  minionKlass: number;
  minionId: number;
}

type BattleLogs = Array<AttackLog | SummonLog>;


export interface GameFrontend {
  gameId: number;
  currentPlayer: string;
  currentTurn: number;
  battleLogs: BattleLogs;
  selectedSkins: {
    player: Array<{key: number, value: number}>;
    opponent: Array<{key: number, value: number}>;
  };
  player: GameFEPlayer;
  opponent: GameFEOpponent;
}
