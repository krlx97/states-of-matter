import type {LogType} from "../../../enums/index.js";

interface GameAttackLog {
  type: LogType.ATTACK;
  playerAtk: string;
  playerDef: string;
  with: number;
  target: number;
  attacked: string;
  attacker: string;
}

export type {GameAttackLog};
