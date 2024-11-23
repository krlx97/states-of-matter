import {contracts, mongo} from "app";
import type {SocketRequest} from "@som/shared/types/backend";

const claimRewards: SocketRequest = (socket, error): void => {
  const socketId = socket.id;
  const {$players} = mongo;

  socket.on("claimRewards" as any, async (): Promise<void> => {
    const $player = await $players.findOne({socketId});

    if (!$player) {
      return error("Player not found.");
    }

    if (!$player.address) {
      return error("Can't claim, address not set.");
    }

    if (BigInt($player.rewards.ecr) < 1n && BigInt($player.rewards.shardPacks) < 1n) {
      return error("No rewards to claim");
    }

    const $playerUpdate = await mongo.$players.updateOne({socketId}, {
      $set: {
        "rewards.shardPacks": "0",
        "rewards.ecr": "0"
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    const tx = await contracts.game.claimRewards(
      $player.address,
      BigInt($player.rewards.ecr),
      BigInt($player.rewards.shardPacks),
    ).catch(console.log);

    if (!tx) {
      return error("Transaction error.");
    }

    const fin = await tx.wait();

    if (!fin) {
      return error("Transaction error.");
    }

    socket.emit("claimRewards" as any);

    socket.emit("notification", {
      color: "success",
      message: "Claimed rewards."
    });
  });
};

export {claimRewards};
