import type {Services} from "models";

export const setAvatar = (services: Services): void => {
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("setAvatar", async (params) => {
    const {avatarId} = params;
    const player = await $players.findOneAndUpdate({socketId}, {
      $set: {avatarId}
    }, {
      returnDocument: "after"
    });

    if (!player.value) { return; }

    const {username, social: {friends}} = player.value;
    const socketIds = await mongoService.getSocketIds(friends);

    socket.emit("setAvatarSender", {avatarId});
    io.to(socketIds).emit("setAvatarReceiver", {username, avatarId});
  });
};
