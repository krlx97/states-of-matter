import type { PlayerDeckCardView } from "./PlayerDeckCardView.js";
interface PlayerDeckView {
    id: number;
    name: string;
    klass: number;
    cardsInDeck: number;
    average: {
        health: number;
        damage: number;
        manaCost: number;
    };
    attribute: {
        minion: number;
        magic: number;
        trap: number;
        neutral: number;
        solid: number;
        liquid: number;
        gas: number;
        plasma: number;
    };
    cards: Array<PlayerDeckCardView>;
}
export type { PlayerDeckView };
