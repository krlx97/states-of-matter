import type { PlayerStatus, QueueId } from "../../enums/index.js";
interface PlayerDeckCardView {
    id: number;
    name: string;
    amount: number;
    manaCost: number;
}
type PlayerDeckCardsView = Array<PlayerDeckCardView>;
interface PlayerDeckView {
    id: number;
    name: string;
    klass: number;
    cardsInDeck: number;
    cards: PlayerDeckCardsView;
}
type PlayerDecksView = Array<PlayerDeckView>;
interface PlayerGamesTotalView {
    won: number;
    lost: number;
}
interface PlayerGamesView {
    casual: PlayerGamesTotalView;
    ranked: PlayerGamesTotalView;
}
interface PlayerSkinView {
    cardId: number;
    skinId: number;
}
type PlayerSkinsView = Array<PlayerSkinView>;
interface PlayerView {
    name: string;
    experience: number;
    level: number;
    elo: number;
    joinedAt: number;
    status: PlayerStatus;
    queueId: QueueId;
    lobbyId: number;
    gamePopupId: number;
    gameId: number;
    deckId: number;
    games: PlayerGamesView;
    decks: PlayerDecksView;
    skins: PlayerSkinsView;
    tutorial: {
        deckBuilder: boolean;
        game: boolean;
        play: boolean;
        wallet: boolean;
    };
}
export type { PlayerDeckCardView, PlayerDeckView, PlayerView };
