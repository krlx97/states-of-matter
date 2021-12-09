import type {Request} from "../../../models";
import type {SaveDeck} from "./saveDeck.models";

const saveDeck: Request<SaveDeck> = async (services, params) => {
  const {ioService, playerService} = services;
  const {cards} = params;
  const {socketId} = ioService;

  const player = await playerService.find({socketId});

  if (!player) { return; }

  const {deckId} = player;

  const isUpdated = await playerService.update({
    socketId,
    "decks.id": deckId
  }, {
    $set: {
      "decks.$.cards": cards
    }
  });

  if (!isUpdated) { return; }

  ioService.emit("saveDeck", {cards});
};

export default saveDeck;
