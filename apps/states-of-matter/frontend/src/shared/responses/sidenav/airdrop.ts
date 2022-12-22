import {miscService, socketService} from "services";
import {accountStore} from "stores";

const airdrop = (): void => {
  const {socket} = socketService;

  socket.on("airdrop", (): void => {
    accountStore.update((store) => {
      const token = store.wallet.fungible.find((token) => token.key.sym.includes("VMT"));

      token.value.total = `${(parseFloat(token.value.total) + 1000).toFixed(4)} ${token.key.sym}`;
      token.value.liquid = `${(parseFloat(token.value.liquid) + 1000).toFixed(4)} ${token.key.sym}`;

      return store;
    });

    miscService.showNotification("You have received 1,000.0000 VMT")
  });
};

export {airdrop};
