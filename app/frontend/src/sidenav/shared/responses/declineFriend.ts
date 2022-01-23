import {playerStore} from "stores/data";

import type {DeclineFriendRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const declineFriend: Res<DeclineFriendRes> = (params) => {
  playerStore.update((player) => {
    const {requests} = player.social;
    const i = requests.indexOf(params.username);

    requests.splice(i, 1);

    return player;
  });
};

export default declineFriend;
