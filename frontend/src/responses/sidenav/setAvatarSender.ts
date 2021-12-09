import {playerStore} from "stores/data";

interface Params { avatarId: number; }

const setAvatarSender = (params: Params): void => {
  playerStore.update((player) => {
    player.avatarId = params.avatarId;
    return player;
  });
};

export default setAvatarSender;
