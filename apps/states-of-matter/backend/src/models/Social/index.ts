import type {Document} from "mongodb";

interface Social extends Document {
  name: string;
  friends: string[];
  requests: string[];
  blocked: string[];
}

export type {Social};
