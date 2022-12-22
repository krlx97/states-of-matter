import {get} from "svelte/store";
import {cryptoService, eccService, miscService, socketService} from "services";
import {accountStore, authStore, playerStore} from "stores";

export const getPrivateKeyHash = (): void => {
  const {socket} = socketService;

  socket.on("getPrivateKeyHash", (params): void => {
    const {privateKeyHash} = params;
    const {name, password} = get(authStore).signinForm;
    const privateKey = cryptoService.decrypt(privateKeyHash, password);

    if (privateKey) {
      const publicKey = eccService.toPublic(privateKey);
      const signature = eccService.sign(`signin:${name}`, privateKey);

      accountStore.update((store) => {
        store.profile.privateKey = privateKey;
        return store;
      });

      socket.emit("signin", {name, publicKey, signature});
    } else {
      miscService.showNotification("Wrong password.");
    }
  });
};
