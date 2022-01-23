import {playerStore} from "stores/data";

import type {AddFriendRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const addFriend: Res<AddFriendRes> = (params) => {
  playerStore.update((player) => {
    player.social.requests.push(params.username);
    return player;
  });
};

export default addFriend;
