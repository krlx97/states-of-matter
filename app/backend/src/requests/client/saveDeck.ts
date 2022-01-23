import type {SaveDeckReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const saveDeck: SocketRequest<SaveDeckReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {cards} = params;
  const {socketId} = socketService;
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

  socketService.emit().saveDeck({cards});
};

export default saveDeck;
