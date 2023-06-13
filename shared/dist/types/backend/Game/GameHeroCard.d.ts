import type { GameCard } from "./GameCard.js";
import type { Ability, CardType, EffectId } from "../../../enums/index.js";
interface GameHeroCard extends GameCard {
    type: CardType.HERO;
    health: number;
    mana: number;
    ability: Ability;
    maxHealth: number;
    maxMana: number;
    buffs: Array<{
        id: EffectId;
        data: any;
    }>;
    debuffs: Array<{
        id: EffectId;
        data: any;
    }>;
}
export type { GameHeroCard };
