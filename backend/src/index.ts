import {contracts, mongo, server} from "app";
import {requests} from "requests";
import {schedule} from "node-cron";
import express from 'express';
import path from "path";

process.on("unhandledRejection", (reason, promise): void => {
  console.log(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (error, origin): void => {
  console.log(`Uncaught Exception: ${error}`);
});

const cleanup = async (): Promise<void> => {
  // remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups when
  // restarting the server?
  // also restart all games timers here as well...
};

await cleanup();

server.app.use(express.static(path.join(process.cwd(), "frontend")));
server.app.get("/", (req, res) => res.sendFile(`${process.cwd()}/frontend/index.html`));
server.app.get("*", (req, res) => res.sendFile(`${process.cwd()}/frontend/index.html`));

server.io.on("connection", (socket): void => {
  const error = (message: string): void => {
    socket.emit("notification", {
      color: "warn",
      message
    });

    console.error(message);
  };

  // for token transfers, wallets already implement sending to address,
  // this allows players to send to "username"
  socket.on("getAddress", async ({name}: any): Promise<void> => {
    const $player = await mongo.$players.findOne({name});

    if (!$player) {
      return error("Player not found.");
    }

    if (!$player.address) {
      return error("This player hasn't connected an address yet.");
    }

    socket.emit("getAddress", {address: $player.address});
  });

  socket.on("claimRewards", async (): Promise<void> => {
    const $player = await mongo.$players.findOne({socketId: socket.id});

    if (!$player) {
      return error("Player not found.");
    }

    if (!$player.address) {
      return error("Can't claim, address not set.");
    }

    if (BigInt($player.rewards.ecr) < 1 && BigInt($player.rewards.ees) < 1) {
      return error("No rewards to claim");
    }

    const $playerUpdate = await mongo.$players.updateOne({socketId: socket.id}, {
      $set: {
        "rewards.ees": "0",
        "rewards.ecr": "0"
      }
    });

    if (!$playerUpdate.modifiedCount) {
      return error("Error updating player.");
    }

    const tx = await contracts.somGame.claimRewards(
      $player.address,
      BigInt($player.rewards.ees),
      BigInt($player.rewards.ecr)
    ).catch(console.log);

    if (!tx) {
      return error("Couldn't push transaction, no tokens were minted.");
    }

    const fin = await tx.wait();

    if (!fin) {
      return error("Error transacting");
    }

    socket.emit("notification", {color: "success", message: "Claimed rewards."});
  });

  requests.forEach((request): void => {
    request(socket, error);
  });
});

server.http.listen(process.env.PORT || 4201);

schedule("0 */6 * * *", async (): Promise<void> => {
  for await (let $player of mongo.$players.find()) {
    if ($player.tasks.daily || $player.tasks.dailyAlternative >= 3) {
      $player.rewards.ecr = `${BigInt($player.rewards.ecr) + 1n * 10n ** 18n}`;
      $player.tasks.weekly += 1;

      if ($player.tasks.weekly >= 7) {
        $player.rewards.ecr = `${BigInt($player.rewards.ecr) + 3n * 10n ** 18n}`;
        $player.tasks.weekly = 0;
      }
    } else {
      $player.tasks.weekly = 0;
    }

    $player.tasks.daily = false;
    $player.tasks.dailyAlternative = 0;

    if ($player.elo > 250) {
      $player.elo -= 1;
    }

    if ($player.elo >= 250) { // silver
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 1n * 10n ** 18n}`;
    } else if ($player.elo >= 500) { // gold
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 3n * 10n ** 18n}`;
    } else if ($player.elo >= 750) { // master
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 5n * 10n ** 18n}`;
    }

    await mongo.$players.replaceOne({name: $player.name}, $player);
  }

  const [deployTimestamp, ees, ecr, enrg] = await Promise.all([
    contracts.somGame.deployTimestamp(),
    contracts.ethericEssence.totalSupply(),
    contracts.ethericCrystals.totalSupply(),
    contracts.ethericEnergy.totalSupply()
  ]);


  const snapshots = await Promise.all([
    mongo.$supplySnapshots.findOne({
      name: "ees"
    }),
    mongo.$supplySnapshots.findOne({
      name: "ecr"
    }),
    mongo.$supplySnapshots.findOne({
      name: "enrg"
    })
  ]);

  const POW = 10n ** 18n;
  const REWARD_PER_MS = 1000000n;
  const date = Date.now();
  const ecrStaked = (enrg * (1n * POW + ((BigInt(date) - deployTimestamp * 1000n) * REWARD_PER_MS))) / POW;
  const supply = ecr + ecrStaked;

  if (!snapshots[0] && !snapshots[1] && !snapshots[2]) {
    await Promise.all([
      mongo.$supplySnapshots.insertOne({
        name: "ees",
        snapshots: [{date, supply: `${ees}`}]
      }),
      mongo.$supplySnapshots.insertOne({
        name: "ecr",
        snapshots: [{date, supply: `${supply}`}]
      }),
      mongo.$supplySnapshots.insertOne({
        name: "enrg",
        snapshots: [{date, supply: `${enrg}`}]
      })
    ]);
  } else {
    await Promise.all([
      mongo.$supplySnapshots.updateOne({
        name: "ees"
      }, {
        $push: {
          "snapshots": {date, supply: `${ees}`}
        }
      }),
      mongo.$supplySnapshots.updateOne({
        name: "ecr"
      }, {
        $push: {
          "snapshots": {date, supply: `${supply}`}
        }
      }),
      mongo.$supplySnapshots.updateOne({
        name: "enrg"
      }, {
        $push: {
          "snapshots": {date, supply: `${enrg}`}
        }
      })
    ]);
  }

  const byLevel = (await mongo.$players
    .find()
    .limit(100)
    .sort({
      level: -1
    })
    .toArray()
  ).map(({name, elo, level, experience, avatarId, bannerId, games}) =>
    ({name, level, elo, experience, avatarId, bannerId, games})
  );

  const byElo = (await mongo.$players
    .find()
    .limit(100)
    .sort({
      elo: -1
    })
    .toArray()
  ).map(($player) => {
    const {name, elo, level, experience, avatarId, bannerId, games} = $player;
    return {name, level, elo, experience, avatarId, bannerId, games};
  });

  const leaderboards = await mongo.$leaderboards.findOne({});

  if (leaderboards) {
    await mongo.$leaderboards.updateOne({}, {
      $set: {level: byLevel, elo: byElo}
    });
  } else {
    await mongo.$leaderboards.insertOne({
      level: byLevel,
      elo: byElo
    });
  }

  for (let {name} of byLevel) {
    const $player = await mongo.$players.findOne({name});

    if ($player) {
      const newValue = `${BigInt($player.rewards.ecr) + (1n * (10n ** 18n))}`
      $player.rewards.ecr = newValue;
      await mongo.$players.replaceOne({name}, $player);
    }
  }

  for (let {name} of byElo) {
    const $player = await mongo.$players.findOne({name});

    if ($player) {
      const newValue = `${BigInt($player.rewards.ecr) + 3n * 10n ** 18n}`
      $player.rewards.ecr = newValue;
      await mongo.$players.replaceOne({name}, $player);
    }
  }

  server.io.emit("notification", {
    color: "success",
    message: "Leaderboards and tasks updated, rewards distributed!"
  });
});
