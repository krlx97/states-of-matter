import type {PlayerSocialList} from "types/mongo/index.js";
import type {PlayerSocialFriendsView} from "./PlayerSocialFriendsView.js";

interface PlayerSocialView {
  friends: PlayerSocialFriendsView;
  requests: PlayerSocialList;
  blocked: PlayerSocialList;
}

export type {PlayerSocialView};
