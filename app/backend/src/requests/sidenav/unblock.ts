import type {Services} from "models";

export const unblock = (services: Services): void => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("unblock", async (params) => {
    const {username} = params;
    const updatePlayer = await $players.updateOne({socketId}, {
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
