import {notificationService, socketService} from "services";

const notification = (): void => {
  socketService.socket.on("notification", (msg): void => {
    notificationService.show(msg);
  });
};

export {notification};
