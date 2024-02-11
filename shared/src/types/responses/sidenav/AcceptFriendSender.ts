import {PlayerStatus} from "../../../enums/index.js";

interface AcceptFriendSender {
  name: string;
  avatarId: number;
  bannerId: number;
  experience: number;
  level: number;
  elo: number;
  status: PlayerStatus;
  lastSender: string;
}

export type {AcceptFriendSender};
