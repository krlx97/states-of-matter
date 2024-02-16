import {cards} from "@som/shared/data";
import {PlayerStatus, QueueId} from "@som/shared/enums";
import type {Player, PlayerSkin} from "@som/shared/types/mongo";

const playerTemplate = (
  name: string,
  passwordHash: string,
  address: string
): Player => ({
  socketId: "",
  passwordHash,
  address,
  nonce: 0,
  name,
  joinedAt: Date.now(),
  status: PlayerStatus.OFFLINE,
  experience: 0,
  level: 1,
  elo: 500,
  avatarId: 1000,
  bannerId: 2000,
  deckId: 0, // should be called deckIndex, because this is actually index.
  queueId: QueueId.NONE,
  lobbyId: 0,
  gameId: 0,
  gamePopupId: 0,
  games: {
    casual: {won: 0, lost: 0},
    ranked: {won: 0, lost: 0}
  },
  social: {
    friends: [],
    requests: [],
    blocked: []
  },
  tasks: {
    daily: false,
    dailyAlternative: 0,
    weekly: 0,
  },
  rewards: {
    ecr: "0",
    ees: "0"
  },
  tutorial: {
    deckBuilder: false,
    game: false,
    play: false,
    inventory: false
  },
  decks: [
    {id: 0, klass: 1, name: "Deck 1", cards: []},
    {id: 1, klass: 2, name: "Deck 2", cards: []},
    {id: 2, klass: 3, name: "Deck 3", cards: []},
    {id: 3, klass: 4, name: "Deck 4", cards: []}
  ],
  skins: cards.map((card): PlayerSkin => ({
    cardId: card.id,
    skinId: parseInt(`1${card.id > 99 ? `${card.id}` : `0${card.id}`}00`)
  }))
});

export {playerTemplate};
