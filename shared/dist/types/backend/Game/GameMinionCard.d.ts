import type { GameCard } from "./GameCard.js";
import type { CardType, EffectId } from "../../../enums/index.js";
interface GameMinionCard extends GameCard {
    type: CardType.MINION;
    health: number;
    damage: number;
    manaCost: number;
    maxHealth: number;
    canAttack: boolean;
    buffs: Array<{
        id: EffectId;
        data: any;
    }>;
    debuffs: Array<{
        id: EffectId;
        data: any;
    }>;
}
export type { GameMinionCard };
