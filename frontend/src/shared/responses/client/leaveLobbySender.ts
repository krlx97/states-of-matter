import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores";

const leaveLobbySender = (): void => {
  const {socket} = socketService;

  socket.on("leaveLobbySender", (): void => {
    lobbyStore.set({
      id: 0,
      host: {
        name: "",
        avatarId: 0
      },
      challengee: {
        name: "",
        avatarId: 0
      }
    });

    playerStore.update((player) => {
      player.status = PlayerStatus.ONLINE;
      player.lobbyId = 0;
      return player;
    });

    socket.emit("updateFriend");
  });
};

export {leaveLobbySender};
