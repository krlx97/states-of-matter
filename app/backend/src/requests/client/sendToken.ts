import type {App} from "models";

export const sendToken = (app: App): void => {
  const {services} = app;
  const {eosService, socketService} = services;
  const {socket} = socketService;

  socket.on("sendToken", async (params) => {
    const transaction = await eosService.transact("transfer", params);

    if (!transaction) {
      socket.emit("notification", "Error sending token.");
      return;
    }
  });
};
