import {mongo, server} from "apis";
import {getSocketIds} from "helpers/player";
import type {SocketRequest} from "@som/shared/types/backend";

const setAvatar: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {accounts, players} = mongo;

  socket.on("setAvatar", async (params) => {
    const {avatarId} = params;

    if (avatarId < 0 || avatarId > 4) {
      return error("Invalid avatar.");
    }

    const $player = await players.findOne({socketId});

    if (!$player) {
      return error("Player not found, try relogging.");
    }

    const $accountUpdate = await accounts.findOneAndUpdate({
      name: $player.name
    }, {
      $set: {avatarId}
    }, {
      returnDocument: "after"
    });

    if (!$accountUpdate.value) {
      return error("Failed to update account.");
    }

    const {name, social} = $accountUpdate.value;
    const socketIds = await getSocketIds(social.friends);

    socket.emit("setAvatarSender", {avatarId});
    server.io.to(socketIds).emit("setAvatarReceiver", {name, avatarId});
  });
};

export {setAvatar};
