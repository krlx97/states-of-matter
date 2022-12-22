import { accountsDb, playersDb } from "apis/mongo";
import type {SocketEvent} from "models";

const declineFriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("declineFriend", async (params) => {
    const {username} = params;

    const $asd = await playersDb.findOne({socketId});

    if (!$asd) { return; }

    const $updatedPlayer = await accountsDb.updateOne({name: $asd.name}, {
      $pull: {
        "social.requests": username
      }
    });

    if (!$updatedPlayer.modifiedCount) { return; }

    socket.emit("declineFriend", {username});
  });
};

export {declineFriend};
