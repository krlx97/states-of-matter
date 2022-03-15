import type {Services} from "models";

export const updateFriend = (services: Services): void => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("updateStatus", async () => {
    const player = await $players.findOne({socketId});

    if (!player) { return; }

    const {username, status, social: {friends}} = player;
    const socketIds = await mongoService.getSocketIds(friends);

    io.to(socketIds).emit("updateStatus", {username, status});
  });
};
