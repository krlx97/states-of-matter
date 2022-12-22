import {accountsDb, playersDb} from "apis/mongo";
import type {SocketEvent} from "models";

const unblock: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("unblock", async (params) => {
    const {username} = params;

    const $asd = await playersDb.findOne({socketId});

    if (!$asd) { return; }

    const updatePlayer = await accountsDb.updateOne({name: $asd.name}, {
      $pull: {
        "social.blocked": username
      }
    });

    if (!updatePlayer.modifiedCount) { return; }

    socket.emit("unblock", {
      friendname: username
    });
  });
};

export {unblock};
