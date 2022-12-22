import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores";

export const joinLobbySender = () => {
  const {socket} = socketService;

  socket.on("joinLobbySender", (params) => {
    lobbyStore.set(params.lobby);

    playerStore.update((player) => {
      player.status = PlayerStatus.INLOBBY;
      return player;
    });

    socket.emit("updateStatus");
  });
};
