import {miscService, socketService} from "services";
import {accountStore} from "stores";

const transferTokenReceiver = (): void => {
  const {socket} = socketService;

  socket.on("transferTokenReceiver", (params): void => {
    accountStore.update((store) => {
      const token = store.wallet.fungible.find((token) => token.symbol === params.quantity.quantity.split(" ")[1]);


      token.liquid = `${parseFloat(token.liquid) + parseFloat(params.quantity.quantity)} ${token.symbol}`;
      return store;
    });

    miscService.showNotification(`You have received ${params.quantity.quantity} from ${params.from}.`);
  });
};

export {transferTokenReceiver};
