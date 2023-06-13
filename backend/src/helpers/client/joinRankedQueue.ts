import {GameType, QueueId} from "@som/shared/enums";
import {mongo} from "apis";
import gameEngine from "helpers/game";

const joinRankedQueue = async (name: string, elo: number): Promise<void> => {
  const {rankedQueuePlayers, players} = mongo;
  const opponents = await rankedQueuePlayers.find().toArray();

  for (const opponent of opponents) {
    if (opponent.elo < elo - 11250 || opponent.elo < elo + 11250) {
      const $casualQueuePlayerDelete = await rankedQueuePlayers.deleteOne({
        name: opponent.name
      });
      const $playerUpdate = await players.updateOne({
        name: opponent.name
      }, {
        $set: {
          queueId: QueueId.NONE
        }
      });
      const $playerUpdate2 = await players.updateOne({
        name
      }, {
        $set: {
          queueId: QueueId.NONE
        }
      });

      if (!$casualQueuePlayerDelete.deletedCount || !$playerUpdate.modifiedCount) {
        console.error("Failed removing player from queue after match found.");
        return;
      }

      await gameEngine.gamePopup(GameType.RANKED, opponent.name, name);

      return;
    }
  }

  const inserted = await rankedQueuePlayers.insertOne({name, elo});

  if (!inserted.insertedId) {
    console.error("Failed to insert player in the queue.");
    return;
  }
};

export {joinRankedQueue};
