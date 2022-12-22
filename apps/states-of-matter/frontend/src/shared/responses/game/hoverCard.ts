import {socketService} from "services";
import {hoveredCardStore} from "stores";

export const hoverCard = (): void => {
  const {socket} = socketService;

  socket.on("hoverCard", (params): void => {
    hoveredCardStore.set(params);
  });
};
