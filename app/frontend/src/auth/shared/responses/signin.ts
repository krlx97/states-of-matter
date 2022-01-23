import {get} from "svelte/store";
import {socketService} from "services";
import {gameStore} from "game/stores";
import {lobbyStore, playerStore} from "stores/data";
import {socialStore} from "stores/view";

import type {SigninRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const signin: Res<SigninRes> = (params) => {
  console.log(params);
  const {player, friends, lobby, game} = params;
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

  socketService.updateStatus();
};

export default signin;
