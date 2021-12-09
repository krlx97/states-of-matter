import type {Request} from "../../../models/index.js";
import type {GetPrivateKeyHash} from "./getPrivateKeyHash.models";

const getPrivateKeyHash: Request<GetPrivateKeyHash> = async (services, params) => {
  const {ioService, playerService} = services;
  const {username} = params;

  const player = await playerService.find({username});

  if (!player) {
    ioService.notification("Player not found.");
    return;
  }

  const {privateKeyHash} = player;
  ioService.emit("getPrivateKeyHash", {privateKeyHash});
};

export default getPrivateKeyHash;
