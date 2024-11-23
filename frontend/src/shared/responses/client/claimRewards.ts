import {get} from "svelte/store";
import {socketService} from "services";
import {inventoryStore, playerStore} from "stores";

const claimRewards = (): void => {
  const {socket} = socketService;

  socket.on("claimRewards", (): void => {
    inventoryStore.update((store) => {
      const $playerStore = get(playerStore);

      store.ecr.balance += BigInt($playerStore.rewards.ecr);
      store.collectibles.shardPacks += BigInt($playerStore.rewards.shardPacks);

      return store;
    });

    playerStore.update((store) => {
      store.rewards.ecr = "0";
      store.rewards.shardPacks = "0";
      return store;
    });
  });
};

export {claimRewards};
