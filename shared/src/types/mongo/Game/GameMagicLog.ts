import type {LogType} from "../../../enums/index.js";

interface GameMagicLog {
  type: LogType.MAGIC;
  player: string;
  magicId: number;
}

export type {GameMagicLog};
