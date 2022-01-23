import {socialStore} from "stores/view";

import type {UpdateFriendRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const updateFriend: Res<UpdateFriendRes> = (params) => {
  const {username, status} = params;

  socialStore.update((store) => {
    const {friends} = store;
    const friend = friends.find((friend) => friend.username === username);

    friend.status = status;

    return store;
  });
};

export default updateFriend;
