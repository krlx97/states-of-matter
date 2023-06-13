import type { Document } from "mongodb";
interface CasualQueuePlayer extends Document {
    name: string;
    level: number;
}
export type { CasualQueuePlayer };
