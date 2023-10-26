import {PlayerStatus} from "@som/shared/enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores";

const closeLobby = (): void => {
  const {socket} = socketService;

  socket.on("closeLobby", (): void => {
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

    playerStore.update((store) => {
      store.status = PlayerStatus.ONLINE;
      store.lobbyId = 0;
      return store;
    });

    socket.emit("updateFriend");
  });
};

export {closeLobby};
