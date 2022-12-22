import {accountsDb, playersDb} from "apis/mongo";
import { ioServer } from "apis/server";
import type {SocketEvent} from "models";

const addFriend: SocketEvent = (socket): void => {
  const socketId = socket.id;

  socket.on("addFriend", async (params) => {
    const {username} = params;
    const [senderP, receiverP] = await Promise.all([
      playersDb.findOne({socketId}),
      playersDb.findOne({name: username})
    ]);

    if (!senderP || !receiverP) { return; }

    const [sender, receiver] = await Promise.all([
      accountsDb.findOne({name: senderP.name}),
      accountsDb.findOne({name: receiverP.name})
    ]);

    if (!sender || !receiver) { return; }

    if (sender.name === username) {
      socket.emit("notification", "You can't add yourself as a friend.");
      return;
    }
    if (receiver.social.blocked.includes(sender.name)) {
      socket.emit("notification", "This player has blocked you.");
      return;
    }
    if (sender.social.blocked.includes(username)) {
      socket.emit("notification", "You have blocked this player.");
      return;
    }
    if (receiver.social.requests.includes(sender.name)) {
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

    const updatePlayer = await accountsDb.updateOne({name: username}, {
      $push: {
        "social.requests": sender.name
      }
    });

    if (!updatePlayer.modifiedCount) { return; }

    socket.emit("notification", "Friend request sent.");
    ioServer.to(receiverP.socketId).emit("addFriend", {
      username: sender.name
    });
  });
};

export {addFriend};
