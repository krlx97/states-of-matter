import type {PlayerStatus} from "enums";

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

interface Player {
  _id?: string;
  socketId: string;
  username: string;
  publicKey: string;
  privateKey: string;
  privateKeyHash: string;
  status: PlayerStatus;
  xp: number;
  lv: number;
  deckId: number;
  avatarId: number;
  lobbyId: number;
  gameId: number;
  decks: PlayerDeck[];
  social: PlayerSocial;
}

export type {PlayerDeckCard, PlayerDeck, PlayerSocial, Player};
