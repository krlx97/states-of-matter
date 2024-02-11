import {contracts, mongo, server} from "app";
import {requests} from "requests";
import {schedule} from "node-cron";

process.on("unhandledRejection", (reason, promise): void => {
  console.log(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (error, origin): void => {
  console.log(`Uncaught Exception: ${error}`);
});

const cleanup = async (): Promise<void> => {
  // remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups when
  // restarting the server?
};

await cleanup();

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

    const tx = await contracts.somGame.claimRewards(
      $player.address,
      BigInt($player.rewards.ees),
      BigInt($player.rewards.ecr)
    ).catch(console.log);

    if (!tx) {
      return error("Couldn't push tx");
    }

    const fin = await tx.wait();

    if (!fin) {
      return error("Error pushing tx");
    }

    await mongo.$players.updateOne({socketId: socket.id}, {
      $set: {
        "rewards.ees": "0",
        "rewards.ecr": "0"
      }
    });

    socket.emit("notification", {color: "success", message: "Claimed rewards."});
  });

  requests.forEach((request): void => {
    request(socket, error);
  });
});

server.http.listen(process.env.PORT || 4201);

schedule("*/10 * * * *", async (): Promise<void> => {
  for await (let $player of mongo.$players.find()) {
    if (!$player.tasks.daily && $player.tasks.dailyAlternative) {
      $player.tasks.weekly = 0;
    }

    $player.tasks.daily = false;
    $player.tasks.dailyAlternative = 0;

    if ($player.elo > 250) {
      $player.elo -= 1;
    }

    if ($player.elo > 249) { // silver
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 1n * 10n ** 18n}`;
    }

    if ($player.elo > 499) { // gold
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 3n * 10n ** 18n}`;
    }

    if ($player.elo > 749) { // master
      $player.rewards.ecr = `${BigInt($player.rewards.ecr) + 1n * 10n ** 18n}`;
    }

    await mongo.$players.replaceOne({name: $player.name}, $player);
  }

  const POW = 10n ** 18n;
  let deployTimestamp = await contracts.somGame.deployTimestamp() * 1000n;
  const REWARD_PER_MS = 1000000n;

  const ees = await contracts.ethericEssence.totalSupply();
  const ecr = await contracts.ethericCrystals.totalSupply();
  const enrg = await contracts.ethericEnergy.totalSupply();

  const liquid = ecr;
  const staked = (enrg * (1n * POW + ((BigInt(Date.now()) - deployTimestamp) * REWARD_PER_MS))) / POW;
  const supply = liquid + staked;

  await mongo.$supplySnapshots.updateOne({name: "ees"}, {
    $push: {
      "snapshots": {date: Date.now(), supply: `${ees}`}
    }
  });

  await mongo.$supplySnapshots.updateOne({name: "ecr"}, {
    $push: {
      "snapshots": {date: Date.now(), supply: `${supply}`}
    }
  });

  await mongo.$supplySnapshots.updateOne({name: "enrg"}, {
    $push: {
      "snapshots": {date: Date.now(), supply: `${enrg}`}
    }
  });

  const byLevel = (await mongo.$players
    .find()
    .limit(100)
    .sort({
      level: -1
    })
    .toArray()
  ).map(({name, elo, level, experience, avatarId, bannerId, games}) => ({name, level, elo, experience, avatarId, bannerId, games}));

  const byElo = (await mongo.$players
    .find()
    .limit(100)
    .sort({
      elo: -1
    })
    .toArray()
  ).map(({name, elo, level, experience, avatarId, bannerId, games}) => ({name, level, elo, experience, avatarId, bannerId, games}));

  mongo.$leaderboards.updateOne({}, {
    $set: {level: byLevel, elo: byElo}
  });

  for (let playa of byLevel) {
    const $P = await mongo.$players.findOne({name: playa.name});
    if ($P) {
      $P.rewards.ecr = `${BigInt($P.rewards.ecr) + 5n * 10n ** 18n}`;
      await mongo.$players.replaceOne({name: playa.name}, $P);
    }
  }

  for (let playa of byElo) {
    const $P = await mongo.$players.findOne({name: playa.name});
    if ($P) {
      $P.rewards.ecr = `${BigInt($P.rewards.ecr) + 10n * 10n ** 18n}`;
      await mongo.$players.replaceOne({name: playa.name}, $P);
    }
  }

  server.io.emit("notification", {
    color: "success",
    message: "Flush complete, refresh the page!"
  });
});
