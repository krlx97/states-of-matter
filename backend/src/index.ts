import {cwd} from "node:process";
import {join} from "path";
import express from "express";
import {schedule} from "node-cron";
import {contracts, mongo, server} from "app";
import {requests} from "requests";

process.on("unhandledRejection", (reason, promise): void => {
  console.log(`Unhandled rejection: ${reason}`);
});

process.on("uncaughtException", (error, origin): void => {
  console.log(`Uncaught Exception: ${error}`);
});

// const cleanup = async (): Promise<void> => {
  // remove all rankedQueuePlayers, casualQueuePlayers, and gamePopups when
  // restarting the server?
  // also restart all games timers here as well...
// };

// await cleanup();

const dir = cwd();
const file = `${dir}/frontend/dist/index.html`;

server.app.use(express.static(join(dir, "frontend/dist")));
server.app.get("/", (request, response): void => response.sendFile(file));
server.app.get("*", (request, response): void => response.sendFile(file));

server.io.on("connection", (socket): void => {
  const error = (message: string): void => {
    const color = "warn";
    socket.emit("notification", {color, message});
    console.error(message);
  };

  requests.forEach((request): void => request(socket, error));
});

server.http.listen(process.env.PORT || 4201);

schedule("0 */8 * * *", async (): Promise<void> => {
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

    if ($player.elo > 400) {
      $player.elo -= 1;
    } else if ($player.elo < 400) {
      $player.elo += 1;
    }

    if ($player.elo >= 600) { // silver
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 1n * 10n ** 18n}`;
    } else if ($player.elo >= 800) { // gold
      $player.rewards.ees = `${BigInt($player.rewards.ees) + 3n * 10n ** 18n}`;
    } else if ($player.elo >= 1000) { // master
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
