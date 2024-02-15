import type { GameHeroCard } from "./GameHeroCard.js";
import type { GameMagicCard } from "./GameMagicCard.js";
import type { GameMinionCard } from "./GameMinionCard.js";
import type { GameTrapCard } from "./GameTrapCard.js";
type GameCard = GameHeroCard | GameMagicCard | GameMinionCard | GameTrapCard;
export type { GameCard };
