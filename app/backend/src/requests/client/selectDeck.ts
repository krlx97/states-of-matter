import type {SelectDeckReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const selectDeck: SocketRequest<SelectDeckReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {deckId} = params;
  const {socketId} = socketService;
  const isUpdated = await playerService.update({socketId}, {
    $set: {deckId}
  });

  if (!isUpdated) { return; }

  socketService.emit().selectDeck({deckId});
};

export default selectDeck;
