import {PlayerStatus} from "@som/shared/enums";
import {modalService, socketService} from "services";
import {lobbyStore, playerStore} from "stores";

const joinLobbySender = (): void => {
  const {socket} = socketService;

  socket.on("joinLobbySender", (params): void => {
    const {lobby} = params;

    lobbyStore.set(lobby);

    playerStore.update((player) => {
      player.status = PlayerStatus.IN_LOBBY;
      player.lobbyId = lobby.id;
      return player;
    });

    modalService.close();
    socket.emit("updateFriend");
  });
};

export {joinLobbySender};
