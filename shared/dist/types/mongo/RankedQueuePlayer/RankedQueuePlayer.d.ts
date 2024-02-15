import type { Document } from "mongodb";
interface RankedQueuePlayer extends Document {
    name: string;
    elo: number;
}
export type { RankedQueuePlayer };
