import type {SocketRequest} from "models";

export const declineFriend: SocketRequest = (services) => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket, socketId} = socketService;

  socket.on("declineFriend", async (params) => {
    const {username} = params;
    const updatedPlayer = await $players.updateOne({socketId}, {
      $pull: {
        "social.requests": username
      }
    });

    if (!updatedPlayer.modifiedCount) { return; }

    socket.emit("declineFriend", {username});
  });
};
