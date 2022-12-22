import {PlayerStatus} from "@som/shared/enums";
import { cardSkins } from "data";
import {socketService} from "services";
import {accountStore, lobbyStore, playerStore} from "stores";
import { get } from "svelte/store";

export const selectSkin = () => {
  const {socket} = socketService;

  socket.on("selectSkin", (params) => {
    const {serial} = params;

    playerStore.update((player) => {
      const nft = get(accountStore).wallet.nonFungible.find((nft) => nft.serial === serial);
      const cardId = nft.attrs.find(attr => attr.attribute_name === "cardid");
      const skinId = nft.attrs.find(attr => attr.attribute_name === "skinid");

      player.selectedSkins.set(cardId.points, skinId.points);

      return player;
    });
  });
};
