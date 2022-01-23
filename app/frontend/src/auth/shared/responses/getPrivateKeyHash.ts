import {get} from "svelte/store";
import {cryptoService, eccService, miscService, socketService} from "services";
import {playerStore} from "stores/data";
import {authStore} from "auth/stores";

import type {GetPrivateKeyHashRes} from "@som/shared/interfaces/responses"
import type {Res} from "models";

const getPrivateKeyHash: Res<GetPrivateKeyHashRes> = (params) => {
  console.log(params);
  const {privateKeyHash} = params;
  const {username, password} = get(authStore).signinForm;
  const privateKey = cryptoService.decrypt(privateKeyHash, password);

  if (privateKey) {
    const publicKey = eccService.toPublic(privateKey);
    const signature = eccService.sign(`signin:${username}`, privateKey);

    playerStore.update((player) => {
      player.privateKey = privateKey;
      return player;
    });

    socketService.signin({username, publicKey, signature});
  } else {
    miscService.showNotification("Wrong password.");
  }
};

export default getPrivateKeyHash;
