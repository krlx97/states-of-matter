import { CardId } from "../enums/index.js";
declare const cardsView: Map<CardId, {
    name: string;
    lore: string;
    effect: {
        name: string;
        description: string;
    };
    skins: never[];
    ability?: undefined;
} | {
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
}>;
export { cardsView };
