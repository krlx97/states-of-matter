import {socketService} from "services";
import {hoveredHandCardStore} from "stores";

export const unhoverHandCard = (): void => {
  const {socket} = socketService;

  socket.on("unhoverHandCard", (): void => {
    console.log("XXX");
    hoveredHandCardStore.set({
      i: -1
    });
  });
};
