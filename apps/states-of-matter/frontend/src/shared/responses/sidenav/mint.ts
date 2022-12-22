import {miscService, socketService} from "services";
import {accountStore} from "stores";

const mint = (): void => {
  const {socket} = socketService;

  socket.on("mint", (params): void => {
    console.log("minted", params);

    accountStore.update((store) => {
      store.wallet.nonFungible.push(params.nft);
      return store;
    });

    miscService.showNotification(`You have minted ${params.nft.tags.title} by ${params.nft.tags.author}.`);
  });
};

export {mint};
