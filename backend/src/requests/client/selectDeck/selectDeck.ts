import type {Request} from "../../../models";
import type {SelectDeck} from "./selectDeck.models";

const selectDeck: Request<SelectDeck> = async (services, params) => {
  const {ioService, playerService} = services;
  const {deckId} = params;
  const {socketId} = ioService;

  const isUpdated = await playerService.update({socketId}, {$set: {deckId}});

  if (!isUpdated) { return; }

  ioService.emit("selectDeck", {deckId});
};

export default selectDeck;
