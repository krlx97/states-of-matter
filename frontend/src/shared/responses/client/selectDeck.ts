import {socketService} from "services";
import { isDeckSame } from "../../../client/DeckBuilder/canSave";
import {deckCache, playerStore} from "stores";
import { get } from "svelte/store";

const selectDeck = (): void => {
  socketService.socket.on("selectDeck", (params): void => {
    const {deckId} = params;

    playerStore.update((player) => {
      player.deckId = deckId;
      return player;
    });

    const $playerStore = get(playerStore);
    const deck = $playerStore.decks[$playerStore.deckId];

    deckCache.set(JSON.parse(JSON.stringify(deck)));

    const $deckCache = get(deckCache);

    isDeckSame($deckCache, deck);
  });
};

export {selectDeck};
