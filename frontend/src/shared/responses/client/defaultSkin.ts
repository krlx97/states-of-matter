import {socketService} from "services";
import {playerStore} from "stores";

const defaultSkin = (): void => {
  socketService.socket.on("defaultSkin", (params): void => {
    playerStore.update((store) => {
      const {skins} = store;
      const skin = skins.find(({cardId}) => cardId === params.cardId);

      skins.splice(skins.indexOf(skin), 1);

      return store;
    });
  });
};

export {defaultSkin};
