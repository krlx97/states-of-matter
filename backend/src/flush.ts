import {contracts, mongo, server} from "app";

const DECIMALS = 10n ** 18n;
const REWARD_PER_MS = 1000000n;

const flush = async (): Promise<void> => {
  const [
    $byLevel,
    $byElo,
    deployTimestamp,
    ecrSupply,
    enrgSupply,
    ecrSnapshots,
    enrgSnapshots,
    leaderboards
  ] = await Promise.all([
    mongo.$players.find().limit(100).sort({
      level: -1
    }).toArray(),
    mongo.$players.find().limit(100).sort({
      elo: -1
    }).toArray(),
    contracts.game.deployTimestamp(),
    contracts.ethericCrystals.totalSupply(),
    contracts.ethericEnergy.totalSupply(),
    mongo.$supplySnapshots.findOne({
      name: "enrg"
    }),
    mongo.$supplySnapshots.findOne({
      name: "ecr"
    }),
    mongo.$leaderboards.findOne({})
  ]);

  const byLevel = $byLevel.map(({name, elo, level, experience, avatarId, bannerId, games}) =>
    ({name, level, elo, experience, avatarId, bannerId, games})
  );

  const byElo = $byElo.map(({name, elo, level, experience, avatarId, bannerId, games}) =>
    ({name, level, elo, experience, avatarId, bannerId, games})
  );

  const date = Date.now();
  const ecrEnergized = (enrgSupply * (1n * DECIMALS + ((BigInt(date) - deployTimestamp * 1000n) * REWARD_PER_MS))) / DECIMALS;
  const ecrTotalSupply = ecrSupply + ecrEnergized;

  for await (let $player of mongo.$players.find()) {
    const {name, elo, rewards, tasks} = $player;
    const isTop100Level = byLevel.find((player): boolean => player.name === name);
    const isTop100Elo = byElo.find((player): boolean => player.name === name);

    let ecrReward = 0n;
    let shardPackReward = 0n;

    if (elo > 400) {
      $player.elo -= 1;
    } else if (elo < 400) {
      $player.elo += 1;
    }

    if (tasks.win) {
      ecrReward += 1n * 10n ** 18n;
      $player.tasks.win = false;
    }

    if (tasks.levelUp) {
      shardPackReward += 1n;
      $player.tasks.levelUp = false;
    }

    if (elo >= 600) {
      ecrReward += 1n * 10n ** 17n; // silver
    } else if (elo >= 800) {
      ecrReward += 2n * 10n ** 17n; // gold
    } else if (elo >= 1000) {
      ecrReward += 3n * 10n ** 17n; // master
    }

    if (isTop100Level) {
      ecrReward += 2n * 10n ** 18n;
    }

    if (isTop100Elo) {
      ecrReward += 3n * 10n ** 18n;
    }

    if (ecrReward > 0n) {
      $player.rewards.ecr = `${BigInt(rewards.ecr) + ecrReward}`;
    }

    if (shardPackReward > 0n) {
      $player.rewards.shardPacks = `${BigInt(rewards.shardPacks) + shardPackReward}`;
    }

    await mongo.$players.replaceOne({name}, $player);
  }

  if (!ecrSnapshots && !enrgSnapshots && !leaderboards) {
    await Promise.all([
      mongo.$supplySnapshots.insertOne({
        name: "ecr",
        snapshots: [{date, supply: `${ecrTotalSupply}`}]
      }),
      mongo.$supplySnapshots.insertOne({
        name: "enrg",
        snapshots: [{date, supply: `${enrgSupply}`}]
      }),
      mongo.$leaderboards.insertOne({
        level: byLevel,
        elo: byElo
      })
    ]);
  } else {
    await Promise.all([
      mongo.$supplySnapshots.updateOne({
        name: "ecr"
      }, {
        $push: {
          snapshots: {date, supply: `${ecrTotalSupply}`}
        }
      }),
      mongo.$supplySnapshots.updateOne({
        name: "enrg"
      }, {
        $push: {
          snapshots: {date, supply: `${enrgSupply}`}
        }
      }),
      mongo.$leaderboards.updateOne({}, {
        $set: {level: byLevel, elo: byElo}
      })
    ]);
  }

  server.io.emit("notification", {
    color: "success",
    message: "Leaderboards and tasks updated, rewards distributed!"
  });
};

export {flush};
