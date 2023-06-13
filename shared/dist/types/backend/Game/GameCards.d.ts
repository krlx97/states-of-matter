import type { GameMagicCard } from "./GameMagicCard.js";
import type { GameMinionCard } from "./GameMinionCard.js";
import type { GameTrapCard } from "./GameTrapCard.js";
type GameCards = Array<GameMagicCard | GameMinionCard | GameTrapCard>;
export type { GameCards };
