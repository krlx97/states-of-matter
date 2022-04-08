import type {App} from "models";

export const updateStatus = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {io, socket, socketId} = socketService;

  socket.on("updateStatus", async () => {
    const $player = await $players.findOne({socketId});

    if (!$player) { return; }

    const {username, status, social} = $player;
    const socketIds = await mongoService.getSocketIds(social.friends);

    io.to(socketIds).emit("updateStatus", {username, status});
  });
};
