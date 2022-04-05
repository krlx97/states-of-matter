import type { Document } from "mongodb";
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
interface PlayerSocial {
    friends: string[];
    requests: string[];
    blocked: string[];
}
interface Player extends Document {
    socketId: string;
    username: string;
    publicKey: string;
    privateKeyHash: string;
    status: number;
    xp: number;
    lv: number;
    deckId: number;
    avatarId: number;
    lobbyId: number;
    gameId: number;
    decks: PlayerDeck[];
    social: PlayerSocial;
}
export type { PlayerDeckCard, PlayerDeck, PlayerSocial, Player };
