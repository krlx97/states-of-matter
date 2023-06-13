import type { Document } from "mongodb";
import type { PlayerStatus, QueueId } from "../../../enums/index.js";
import type { PlayerDecks } from "./PlayerDecks.js";
import type { PlayerGames } from "./PlayerGames.js";
import type { PlayerSkins } from "./PlayerSkins.js";
interface Player extends Document {
    name: string;
    experience: number;
    level: number;
    elo: number;
    joinedAt: number;
    status: PlayerStatus;
    socketId: string;
    queueId: QueueId;
    lobbyId: number;
    gamePopupId: number;
    gameId: number;
    deckId: number;
    games: PlayerGames;
    decks: PlayerDecks;
    skins: PlayerSkins;
    tutorial: {
        deckBuilder: boolean;
        game: boolean;
        play: boolean;
        wallet: boolean;
    };
}
export type { Player };
