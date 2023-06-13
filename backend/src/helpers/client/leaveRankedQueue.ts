import {PlayerStatus} from "@som/shared/enums";
import {mongo} from "apis";

const leaveRankedQueue = async (name: string): Promise<void> => {
  const [deleteRankedQueuePlayer, updatePlayer] = await Promise.all([
    mongo.rankedQueuePlayers.deleteOne({name}),
    mongo.players.updateOne({name}, {
      $set: {
        status: PlayerStatus.ONLINE,
        queueId: 0
      }
    })
  ]);

  if (!deleteRankedQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
    console.error("Error removing player from queue.");
    return;
  }
};

export {leaveRankedQueue};
