import {socketService} from "services";
import {leaderboardsStore} from "stores";

const getLeaderboards = (): void => {
  socketService.socket.on("getLeaderboards", (params): void => {
    leaderboardsStore.set(params);
  });
};

export {getLeaderboards};
