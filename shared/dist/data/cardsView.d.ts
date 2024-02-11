import { CardId } from "../enums/index.js";
type Color = "neutral" | "solid" | "liquid" | "gas" | "plasma" | "damage" | "mana" | "health";
type ColorParam = [Color, string];
type ColorTooltip = Array<string | ColorParam>;
declare const cardsView: ({
    id: CardId;
    name: string;
    lore: string;
    effect: {
        name: string;
        description: ColorTooltip;
    };
    skins: never[];
    ability?: undefined;
} | {
    id: CardId;
    name: string;
    lore: string;
    effect: {
        name: string;
        description: ColorTooltip;
    };
    skins: never[];
    ability: {
        name: string;
        description: ColorTooltip;
    };
} | {
    id: CardId;
    name: string;
    lore: string;
    effect: {
        name: string;
        description: string;
    };
    skins: never[];
    ability: {
        name: string;
        description: string;
    };
} | {
    id: CardId;
    name: string;
    lore: string;
    effect: {
        name: string;
        description: string;
    };
    skins: never[];
    ability?: undefined;
})[];
export { cardsView };
