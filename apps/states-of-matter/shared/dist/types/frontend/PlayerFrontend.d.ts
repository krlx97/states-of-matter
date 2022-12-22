import type { PlayerStatus } from "../../enums/index.js";
interface PlayerDeckCard {
    id: number;
    amount: number;
}
interface PlayerDeck {
    id: number;
    name: string;
    klass: number;
    cards: PlayerDeckCard[];
}
interface Games {
    casual: {
        won: number;
        lost: number;
    };
    ranked: {
        won: number;
        lost: number;
        elo: number;
    };
}
interface PlayerFrontend {
    name: string;
    status: PlayerStatus;
    xp: number;
    lv: number;
    deckId: number;
    lobbyId: number;
    gameId: number;
    games: Games;
    decks: PlayerDeck[];
    selectedSkins: any;
}
export type { PlayerDeckCard, PlayerDeck, PlayerFrontend };
