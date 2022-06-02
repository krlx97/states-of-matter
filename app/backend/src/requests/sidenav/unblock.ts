import { playersDb } from "apis/mongo";
import type {SocketEvent} from "models";

const unblock: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("unblock", async (params) => {
    const {username} = params;
    const updatePlayer = await playersDb.updateOne({socketId}, {
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
