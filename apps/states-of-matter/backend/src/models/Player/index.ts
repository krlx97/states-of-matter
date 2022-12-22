import type {Document} from "mongodb";

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
    won: number,
    lost: number
  };
  ranked: {
    won: number,
    lost: number,
    elo: number
  }
}

interface Player extends Document {
  socketId: string;
  name: string;
  status: number;
  xp: number;
  lv: number;
  deckId: number;
  lobbyId: number;
  gameId: number;
  decks: PlayerDeck[];
  games: Games;
}

export type {PlayerDeckCard, PlayerDeck, Player};
