import {get} from "svelte/store";
import {cryptoService, eccService, miscService, socketService} from "services";
import {authStore, playerStore} from "stores/data";

interface Params { privateKeyHash: string; }

const getPrivateKeyHash = (params: Params): void => {
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

    socketService.emit("signin", {username, publicKey, signature});
  } else {
    miscService.showNotification("Wrong password.");
  }
};

export default getPrivateKeyHash;
