import {playersDb} from "apis/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const addFriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("addFriend", async (params) => {
    const {username} = params;
    const [sender, receiver] = await Promise.all([
      playersDb.findOne({socketId}),
      playersDb.findOne({username})
    ]);

    if (!sender || !receiver) { return; }

    if (sender.username === username) {
      socket.emit("notification", "You can't add yourself as a friend.");
      return;
    }
    if (receiver.social.blocked.includes(sender.username)) {
      socket.emit("notification", "This player has blocked you.");
      return;
    }
    if (sender.social.blocked.includes(username)) {
      socket.emit("notification", "You have blocked this player.");
      return;
    }
    if (receiver.social.requests.includes(sender.username)) {
      socket.emit("notification", "You have already sent the request to this player.");
      return;
    }
    if (sender.social.requests.includes(username)) {
      socket.emit("notification", "This player has already sent you the request.");
      return;
    }
    if (sender.social.friends.includes(username)) {
      socket.emit("notification", "This player is already your friend.");
      return;
    }

    const updatePlayer = await playersDb.updateOne({username}, {
      $push: {
        "social.requests": sender.username
      }
    });

    if (!updatePlayer.modifiedCount) { return; }

    socket.emit("notification", "Friend request sent.");
    ioServer.to(receiver.socketId).emit("addFriend", {
      username: sender.username
    });
  });
};

export {addFriend};
