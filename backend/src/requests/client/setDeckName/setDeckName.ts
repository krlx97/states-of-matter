import type {Request} from "../../../models";
import type {SetDeckName} from "./setDeckName.models";

const setDeckName: Request<SetDeckName> = async (services, params) => {
  const {ioService, playerService} = services;
  const {id, name} = params;
  const {socketId} = ioService;

  const isUpdated = await playerService.update({
    socketId,
    "decks.id": id
  }, {
    $set: {
      "decks.$.name": name
    }
  });

  if (!isUpdated) { return; }

  ioService.emit("setDeckName", {id, name});
};

export default setDeckName;
