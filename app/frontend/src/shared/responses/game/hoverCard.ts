import {socketService} from "services";
import {hoveredCardStore} from "stores";

export const hoverCard = () => {
  const {socket} = socketService;

  socket.on("hoverCard", (params) => { hoveredCardStore.set(params); });
};
