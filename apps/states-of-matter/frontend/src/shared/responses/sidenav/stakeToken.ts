import {miscService, socketService} from "services";
import {accountStore} from "stores";

const stakeToken = (): void => {
  const {socket} = socketService;

  socket.on("stakeToken", (params): void => {
    accountStore.update((store) => {
      const token = store.wallet.fungible.find((token) => token.symbol === params.token.quantity.split(" ")[1]);

      token.liquid = `${parseFloat(token.liquid) - parseFloat(params.token.quantity)} ${token.symbol}`;
      token.staked = `${parseFloat(token.staked) + parseFloat(params.token.quantity)} ${token.symbol}`;
      store.profile.nonce += 1;

      return store;
    });

    miscService.showNotification(`You have staked ${params.token.quantity}.`);
  });
};

export {stakeToken};
