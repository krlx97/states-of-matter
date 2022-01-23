import {playerStore} from "stores/data";

import type {SetAvatarSenderRes} from "@som/shared/interfaces/responses";
import type {Res} from "models";

const setAvatarSender: Res<SetAvatarSenderRes> = (params) => {
  playerStore.update((player) => {
    player.avatarId = params.avatarId;
    return player;
  });
};

export default setAvatarSender;
