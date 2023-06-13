import {PlayerStatus} from "@som/shared/enums";
import {mongo} from "apis";

const leaveCasualQueue = async (name: string): Promise<void> => {
  const {casualQueuePlayers, players} = mongo;
  const [deleteCasualQueuePlayer, updatePlayer] = await Promise.all([
    casualQueuePlayers.deleteOne({name}),
    players.updateOne({name}, {
      $set: {
        status: PlayerStatus.ONLINE,
        queueId: 0
      }
    })
  ]);

  if (!deleteCasualQueuePlayer.deletedCount || !updatePlayer.modifiedCount) {
    console.error("Error removing player from queue.");
    return;
  }
};

export {leaveCasualQueue};
