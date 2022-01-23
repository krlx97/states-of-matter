import type {SetDeckKlassReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const setDeckKlass: SocketRequest<SetDeckKlassReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {deckId, klass} = params;
  const {socketId} = socketService;
  const isUpdated = await playerService.update({
    socketId,
    "decks.id": deckId
  }, {
    $set: {
      "decks.$.klass": klass
    }
  });

  if (!isUpdated) { return; }

  socketService.emit().setDeckKlass({deckId, klass});
};

export default setDeckKlass;
