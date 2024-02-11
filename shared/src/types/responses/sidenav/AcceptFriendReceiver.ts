import {PlayerStatus} from "../../../enums/index.js";

interface AcceptFriendReceiver {
  name: string;
  avatarId: number;
  bannerId: number;
  experience: number;
  level: number;
  elo: number;
  status: PlayerStatus;
}

export {AcceptFriendReceiver};
