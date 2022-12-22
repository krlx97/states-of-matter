import { Ability } from "../../enums/index.js";
interface Hero {
    klass: number;
    name: string;
    health: number;
    mana: number;
    lore: string;
    ability: Ability;
}
export type { Hero };
