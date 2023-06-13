import {socketService} from "services";
import {playerStore} from "stores";

const selectSkin = (): void => {
  socketService.socket.on("selectSkin", (params): void => {
    const {cardId, skinId} = params;

    playerStore.update((store) => {
      const {skins} = store;
      const skin = skins.find((skin) => skin.cardId === cardId);

      if (skin) {
        skin.skinId = skinId;
      } else {
        skins.push(params);
      }

      return store;
    });
  });
};

export {selectSkin};
