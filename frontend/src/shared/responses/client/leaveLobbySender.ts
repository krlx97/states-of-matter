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
        experience: 0,
        level: 0,
        elo: 0,
        avatarId: 0,
        bannerId: 0,
        games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}}
      },
      challengee: undefined
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
