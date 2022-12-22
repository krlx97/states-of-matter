import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores";

export const leaveLobbySender = () => {
  const {socket} = socketService;

  socket.on("leaveLobbySender", () => {
    lobbyStore.set({
      lobbyId: 0,
      host: {
        name: "",
        socketId: "",
        avatarId: 0
      },
      challengee: {
        name: "",
        socketId: "",
        avatarId: 0
      }
    });

    playerStore.update((player) => {
      player.status = PlayerStatus.ONLINE;
      return player;
    });

    socket.emit("updateStatus");
  });
};
