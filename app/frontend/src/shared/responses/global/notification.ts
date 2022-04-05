import {miscService, socketService} from "services";

export const notification = () => {
  socketService.socket.on("notification", (msg) => {
    miscService.showNotification(msg);
  });
};
