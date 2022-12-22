import { accountsDb, playersDb } from "apis/mongo";
import { getSocketIds } from "helpers/player";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const setAvatar: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("setAvatar", async (params) => {
    const {avatarId} = params;

    const $asd = await playersDb.findOne({socketId});

    if (!$asd) { return; }

    const player = await accountsDb.findOneAndUpdate({name: $asd.name}, {
      $set: {
        "profile.avatarId": avatarId
      }
    }, {
      returnDocument: "after"
    });

    if (!player.value) { return; }

    const {name, social: {friends}} = player.value;
    const socketIds = await getSocketIds(friends);

    socket.emit("setAvatarSender", {avatarId});
    ioServer.to(socketIds).emit("setAvatarReceiver", {username: name, avatarId});
  });
};

export {setAvatar};
