import type { PlayerGames } from "types/mongo/index.js";
interface PlayerSocialFriendView {
    name: string;
    avatarId: number;
    bannerId: number;
    experience: number;
    level: number;
    elo: number;
    status: number;
    games: PlayerGames;
}
export type { PlayerSocialFriendView };
