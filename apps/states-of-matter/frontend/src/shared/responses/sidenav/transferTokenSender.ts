import {miscService, socketService} from "services";
import {accountStore} from "stores";

const transferTokenSender = (): void => {
  const {socket} = socketService;

  socket.on("transferTokenSender", (params): void => {
    accountStore.update((store) => {
      const token = store.wallet.fungible.find((token) => token.symbol === params.quantity.quantity.split(" ")[1]);

      token.liquid = `${parseFloat(token.liquid) - parseFloat(params.quantity.quantity)} ${token.symbol}`;
      store.profile.nonce += 1;

      return store;
    });

    miscService.showNotification(`You have sent ${params.quantity.quantity} to ${params.to}.`);
  });
};

export {transferTokenSender};
