import type {Request} from "../../../models";
import type {SetDeckKlass} from "./setDeckKlass.models";

const setDeckKlass: Request<SetDeckKlass> = async (services, params) => {
  const {ioService, playerService} = services;
  const {deckId, klass} = params;
  const {socketId} = ioService;

  const isUpdated = await playerService.update({
    socketId,
    "decks.id": deckId
  }, {
    $set: {
      "decks.$.klass": klass
    }
  });

  if (!isUpdated) { return; }

  ioService.emit("setDeckKlass", {deckId, klass});
};

export default setDeckKlass;
