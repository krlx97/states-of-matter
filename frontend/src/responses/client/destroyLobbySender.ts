import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";

const destroyLobbySender = (): void => {
  const {username} = get(playerStore);

  lobbyStore.set({
    lobbyId: 0,
    host: {
      username: "",
      avatarId: 0
    },
    challengee: {
      username: "",
      avatarId: 0
    }
  });

  playerStore.update((player) => {
    player.status = PlayerStatus.ONLINE;
    return player;
  });

  socketService.emit("updateFriend", {username});
};

export default destroyLobbySender;
