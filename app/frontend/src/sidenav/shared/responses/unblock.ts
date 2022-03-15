import {playerStore} from "stores/data";

import type {UnblockRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const unblock: Res<UnblockRes> = (params) => {
  playerStore.update((player) => {
    const {blocked} = player.social;
    const i = blocked.indexOf(params.friendname);

    blocked.splice(i, 1);

    return player;
  });
};

export default unblock;
