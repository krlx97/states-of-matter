import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores";

export const destroyLobby = () => {
  const {socket} = socketService;

  socket.on("destroyLobby", () => {
    lobbyStore.set({
      lobbyId: 0,
      host: {
        username: "",
        socketId: "",
        avatarId: 0
      },
      challengee: {
        username: "",
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
