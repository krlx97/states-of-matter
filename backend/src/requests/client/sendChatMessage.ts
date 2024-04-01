import {mongo, server} from "app";
import type {SocketRequest} from "@som/shared/types/backend";
import { getSocketIds } from "helpers/playerHelpers/getSocketIds";

const sendChatMessage: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players, $chats, $lobbies} = mongo;

  socket.on("sendChatMessage", async (params) => {
    const {receiver, text} = params;

    if (text.length > 64) {
      return error("Message too long.");
    }

    const [$playerSender] = await Promise.all([
      $players.findOne({socketId}),
      // $players.findOne({
      //   name: receiver
      // })
    ]);

    if (!$playerSender) {
      return error("Player sender not found, try relogging.");
    }

    // if (!$playerReceiver) {
    //   return error("Player receiver not found, try relogging.");
    // }

    if (!$playerSender.lobbyId) {
      return error("You're not in a lobby.");
    }

    const $lobby = await $lobbies.findOne({
      id: $playerSender.lobbyId
    });

    if (!$lobby) {
      return error("Lobby not found.");
    }

    const date = Date.now();

    $lobby.messages.push({
      name: $playerSender.name,
      text,
      date
    });

    if ($lobby.messages.length > 10) {
      $lobby.messages.shift();
    }

    const $lobbyReplace = await $lobbies.updateOne({
      id: $playerSender.lobbyId
    }, {
      $set: {
        messages: $lobby.messages
      }
    });

    if (!$lobbyReplace.modifiedCount) {
      return error("Error updating chat.");
    }

    const sender = $playerSender.name;

    let b;
    const a = await $players.findOne({name: $lobby.host.name});

    if (!a) { return; }

    if ($lobby.challengee) {
      b = await $players.findOne({name: $lobby.challengee.name});
    }

    // let socketIds;

    // if (b) {
    //   socketIds = getSocketIds([a.socketId, b.socketId]);
    // } else {
    //   socketIds = getSocketIds([a.socketId]);
    // }

    server.io.to([a.socketId, b?.socketId || ""]).emit("sendChatMessageSender" as any, {sender, text, date});
    // socket.emit("sendChatMessageSender", {sender, text, date});

    // if ($lobby.challengee) {
    // }

    // server
    //   .io
    //   .to($playerReceiver.socketId)
    //   .emit("sendChatMessageReceiver", {sender, text, date});
  });
};

export {sendChatMessage};
