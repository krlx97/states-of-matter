import {playerStore} from "stores/data";

interface Params { friendname: string; }

const unblock = (params: Params): void => {
  const {friendname} = params;

  playerStore.update((player) => {
    const {blocked} = player.social;
    const i = blocked.indexOf(friendname);

    blocked.splice(i, 1);

    return player;
  });
};

export default unblock;
