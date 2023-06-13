import type { PlayerDeckCards } from "./PlayerDeckCards.js";
interface PlayerDeck {
    id: number;
    name: string;
    klass: number;
    cards: PlayerDeckCards;
}
export type { PlayerDeck };
