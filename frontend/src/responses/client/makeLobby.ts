import {get} from "svelte/store";
import {PlayerStatus} from "enums";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";
import type {Lobby} from "models/data";

interface Params { lobby: Lobby; }

const makeLobby = (params: Params): void => {
  const {lobby} = params;
  const {username} = get(playerStore);

  lobbyStore.set(lobby);

  playerStore.update((player) => {
    player.status = PlayerStatus.INLOBBY;
    return player;
  });

  socketService.emit("updateFriend", {username});
};

export default makeLobby;
