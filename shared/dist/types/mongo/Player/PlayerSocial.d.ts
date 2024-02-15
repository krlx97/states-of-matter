import type { PlayerSocialList } from "./PlayerSocialList.js";
interface PlayerSocial {
    friends: PlayerSocialList;
    requests: PlayerSocialList;
    blocked: PlayerSocialList;
}
export type { PlayerSocial };
