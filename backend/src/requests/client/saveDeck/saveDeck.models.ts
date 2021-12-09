import type {PlayerDeckCard} from "../../../services/PlayerService/PlayerService.models";

interface SaveDeck {
  cards: Array<PlayerDeckCard>;
}

export type {SaveDeck};
