import type { LogType } from "../../../enums/index.js";
interface GameMinionLog {
    type: LogType.SUMMON;
    player: string;
    field: string;
    minionId: number;
}
export type { GameMinionLog };
