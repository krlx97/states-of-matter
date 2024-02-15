import type { GameAttackLog } from "./GameAttackLog.js";
import type { GameMagicLog } from "./GameMagicLog.js";
import type { GameMinionLog } from "./GameMinionLog.js";
type GameLogs = Array<GameAttackLog | GameMagicLog | GameMinionLog>;
export type { GameLogs };
