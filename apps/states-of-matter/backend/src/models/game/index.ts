import {Ability, CardId, CardKlass, CardType} from "@som/shared/enums";
import type {Document} from "mongodb";

type GameType = "casual" | "ranked" | "custom";

type SelectedSkins = Array<any>;

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

interface Game extends Document {
  gameId: number;
  type: GameType;
  currentPlayer: string;
  currentTurn: number;
  battleLogs: BattleLogs;
  selectedSkins: {
    playerA: {
      name: string;
      list: Array<{
        key: number;
        value: number;
      }>;
    };
    playerB: {
      name: string;
      list: Array<{
        key: number;
        value: number;
      }>;
    };
  };
  playerA: GamePlayer;
  playerB: GamePlayer;
}

interface GameCard {
  id: number;
  gid: number;
  klass: number;
  type: number;
  name: string;
  manaCost: number;
  effect: {
    id: number;
    type: number;
  };
  buffs: Array<number>;
  debuffs: Array<number>;
}

type GameCards = Array<GameMagic | GameMinion | GameTrap>;

interface GameHero {
  id: CardId;
  name: string;
  klass: CardKlass;
  type: CardType;
  health: number;
  mana: number;
  ability: Ability;
  maxHealth: number;
  maxMana: number;
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
  name: string;
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
  selectedSkins: SelectedSkins;
}

interface GameTrap extends GameCard {}

export {LogType};

export type {
  AttackLog,
  SummonLog,
  Game,
  GameType,
  GameCard,
  GameCards,
  GameHero,
  GameMagic,
  GameMinion,
  GamePlayer,
  GameTrap
};
