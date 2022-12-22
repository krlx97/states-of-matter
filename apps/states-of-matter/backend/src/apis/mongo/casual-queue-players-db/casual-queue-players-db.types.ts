import type {Document} from "mongodb";

interface CasualQueuePlayers extends Document {
  username: string;
  lv: number;
}

export type {CasualQueuePlayers};
