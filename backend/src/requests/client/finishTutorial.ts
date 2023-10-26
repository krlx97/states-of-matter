import {mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const finishTutorial: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("finishTutorial", async (params) => {
    const {tutorial} = params;

    if (
      tutorial !== "deckBuilder" &&
      tutorial !== "inventory" &&
      tutorial !== "play"
    ) {
      return error("Invalid tutorial.");
    }

    const $playerUpdate = await $players.updateOne({socketId}, {
      $set: {
        [`tutorial.${tutorial}`]: true
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Failed to update player.");
    }

    socket.emit("finishTutorial", {tutorial});
  });
};

export {finishTutorial};
