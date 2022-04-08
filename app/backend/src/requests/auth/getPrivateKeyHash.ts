import type {App} from "models";

export const getPrivateKeyHash = (app: App): void => {
  const {services} = app;
  const {mongoService, socketService} = services;
  const {$players} = mongoService;
  const {socket} = socketService;

  socket.on("getPrivateKeyHash", async (params) => {
    const {username} = params;
    const $player = await $players.findOne({username});

    if (!$player) {
      socket.emit("notification", "Player not found.");
      return;
    }

    const {privateKeyHash} = $player;
    socket.emit("getPrivateKeyHash", {privateKeyHash});
  });
};
