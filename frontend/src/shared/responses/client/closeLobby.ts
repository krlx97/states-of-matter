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
    experience: 0,
    level: 0,
    elo: 0,
    avatarId: 0,
    bannerId: 0,
    games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}}
  },
  challengee: {
    name: "",
    experience: 0,
    level: 0,
    elo: 0,
    avatarId: 0,
    bannerId: 0,
    games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}}
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
