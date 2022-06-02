import { playersDb } from "apis/mongo";
import { getSocketIds } from "helpers/player";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const setAvatar: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("setAvatar", async (params) => {
    const {avatarId} = params;
    const player = await playersDb.findOneAndUpdate({socketId}, {
      $set: {avatarId}
    }, {
      returnDocument: "after"
    });

    if (!player.value) { return; }

    const {username, social: {friends}} = player.value;
    const socketIds = await getSocketIds(friends);

    socket.emit("setAvatarSender", {avatarId});
    ioServer.to(socketIds).emit("setAvatarReceiver", {username, avatarId});
  });
};

export {setAvatar};
