import {cards} from "@som/shared/data";
import {CardType} from "@som/shared/enums";
import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const saveDeck: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("saveDeck", async (params) => {
    const {deck} = params;

    if (deck.name.length >= 12) {
      return error("Maximum 12 characters length allowed for deck name.");
    }

    if (deck.klass < 1 || deck.klass > 4) { // prevent decimals?
      return error("Invalid class.");
    }

    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    for (const deckCard of deck.cards) {
      const card = cards.find((card) => card.id === deckCard.id);

      if (!card) {
        return error("One of the cards in your deck is invalid.");
      }

      if (card.type === CardType.HERO) {
        return error("Can't add Hero as a deck card.");
      }

      if (deckCard.amount > 2 || deckCard.amount < 1) { // prevent decimals?
        return error("Invalid amount of same cards added.");
      }
    }

    const totalCards = deck.cards.reduce((acc, {amount}) => acc += amount, 0);

    if (totalCards !== 30) {
      return error("Invalid number of cards, should be 30.");
    }

    const $playerUpdate = await $players.updateOne({
      socketId,
      "decks.id": $player.deckId
    }, {
      $set: {
        "decks.$": deck
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    socket.emit("saveDeck", {deck});
  });
};

export {saveDeck};
