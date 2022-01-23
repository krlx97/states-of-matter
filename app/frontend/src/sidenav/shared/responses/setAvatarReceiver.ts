import {socialStore} from "stores/view";

import type {SetAvatarReceiverRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const setAvatarReceiver: Res<SetAvatarReceiverRes> = (params) => {
  const {username, avatarId} = params;

  socialStore.update((store) => {
    const friend = store.friends.find((friend) => friend.username === username);
    friend.avatarId = avatarId;
    return store;
  });
};

export default setAvatarReceiver;
