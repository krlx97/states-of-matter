import {socketService} from "services";
import {hoveredCardStore} from "stores";

export const unhoverCard = () => {
  const {socket} = socketService;

  socket.on("unhoverCard", () => {
    hoveredCardStore.set({
      field: ""
    });
  });
};
