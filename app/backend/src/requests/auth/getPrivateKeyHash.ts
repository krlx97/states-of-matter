import type {GetPrivateKeyHashReq} from "@som/shared/interfaces/requests";
import type {SocketRequest} from "models";

const getPrivateKeyHash: SocketRequest<GetPrivateKeyHashReq> = async (services, params) => {
  const {playerService, socketService} = services;
  const {username} = params;
  const player = await playerService.find({username});

  if (!player) {
    const msg = "Player not found.";
    socketService.emit().notification({msg});
    return
  }

  const {privateKeyHash} = player;
  socketService.emit().getPrivateKeyHash({privateKeyHash});
};

export default getPrivateKeyHash;
