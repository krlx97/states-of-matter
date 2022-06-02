import {socketService} from "services";
import {hoveredHandCardStore} from "stores";

export const hoverHandCard = (): void => {
  const {socket} = socketService;

  socket.on("hoverHandCard", (params): void => {
    hoveredHandCardStore.set(params);
  });
};
