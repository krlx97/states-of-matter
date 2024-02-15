interface GetLeaderboards {
    byLevel: Array<{
        name: string;
        level: number;
        avatarId: number;
    }>;
    byElo: Array<{
        name: string;
        elo: number;
        avatarId: number;
    }>;
}
export type { GetLeaderboards };
