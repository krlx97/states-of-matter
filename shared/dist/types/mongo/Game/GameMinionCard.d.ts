import type { GameBaseCard } from "./GameBaseCard.js";
import type { CardType, EffectId } from "../../../enums/index.js";
interface Attribute {
    current: number;
    default: number;
}
interface GameMinionCard extends GameBaseCard {
    type: CardType.MINION;
    health: Attribute;
    damage: Attribute;
    manaCost: Attribute;
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
