import type {SetDeckNameReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const setDeckName: SocketRequest<SetDeckNameReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {id, name} = params;
  const {socketId} = socketService;
  const isUpdated = await playerService.update({
    socketId,
    "decks.id": id
  }, {
    $set: {
      "decks.$.name": name
    }
  });

  if (!isUpdated) { return; }

  socketService.emit().setDeckName({id, name});
};

export default setDeckName;
