import {GameType, QueueId} from "@som/shared/enums";
import {mongo} from "apis";
import gameEngine from "helpers/game";

const joinCasualQueue = async (name: string, level: number): Promise<void> => {
  const {casualQueuePlayers, players} = mongo;
  const opponents = await casualQueuePlayers.find().toArray();

  for (const opponent of opponents) { // maybe create an interval and loop every 20 seconds for matchmaking
    if (opponent.level < level - 100 || opponent.level < level + 100) {
      const $casualQueuePlayerDelete = await casualQueuePlayers.deleteOne({
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

      await gameEngine.gamePopup(GameType.CASUAL, opponent.name, name);

      return;
    }
  }

  const $casualQueuePlayerInsert = await casualQueuePlayers.insertOne({name, level});

  if (!$casualQueuePlayerInsert.insertedId) {
    console.error("Failed to insert player in the queue.");
    return;
  }

  // player queue id is set in joinQueue request.
};

export {joinCasualQueue};
