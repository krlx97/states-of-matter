import {get} from "svelte/store";
import {socketService} from "services";
import {lobbyStore, playerStore} from "stores/data";
import {gameStore} from "game/stores";
import {socialStore} from "stores/view";

import type {Game, Lobby, Player} from "models/data";
import type {Friend} from "models/view/Social";

interface Params {
  player: Player;
  friends: Friend[];
  lobby: Lobby | undefined;
  game: Game | undefined;
}

const signin = (params: Params): void => {
  const {player, friends, lobby, game} = params;
  const {username, status} = player;
  const {privateKey} = get(playerStore);

  playerStore.set(player);
  playerStore.update((store) => {
    store.privateKey = privateKey;
    return store;
  });

  socialStore.update((store) => {
    store.friends = friends;
    return store;
  });

  if (lobby) { lobbyStore.set(lobby); }
  if (game) { gameStore.set(game); }

  socketService.emit("updateFriend", {username, status});
};

export default signin;
