import {miscService, socketService} from "services";
import {accountStore} from "stores";

const unstakeToken = (): void => {
  const {socket} = socketService;

  socket.on("unstakeToken", (params): void => {
    accountStore.update((store) => {
      const token = store.wallet.fungible.find((token) => token.symbol === params.token.quantity.split(" ")[1]);

      token.staked = `${parseFloat(token.staked) - parseFloat(params.token.quantity)} ${token.symbol}`;
      token.unstaking = `${parseFloat(token.unstaking) + parseFloat(params.token.quantity)} ${token.symbol}`;
      token.claimable.push({
        key: Date.now() / 1000,
        value: params.token.quantity
      })
      store.profile.nonce += 1;

      return store;
    });

    miscService.showNotification(`You have unstaked ${params.token.quantity} and you can claim them after 21 days.`);
  });
};

export {unstakeToken};
