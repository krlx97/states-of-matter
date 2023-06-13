import {randomInt} from "crypto";
import {GameType, PlayerStatus} from "@som/shared/enums";
import {mongo, server} from "apis";

const gamePopup = async (type: GameType, playerA: string, playerB: string) => {
  const {gamePopups, players} = mongo;
  const {io} = server;
  const id = randomInt(1, 1000000001);

  const [a, b] = await Promise.all([
    players.findOneAndUpdate({
      name: playerA
    }, {
      $set: {
        gamePopupId: id
      }
    }, {
      returnDocument: "after"
    }),
    players.findOneAndUpdate({
      name: playerB
    }, {
      $set: {
        gamePopupId: id
      }
    }, {
      returnDocument: "after"
    })
  ]);

  if (!a.value || !b.value) {
    return;
  }

  const inserted = await gamePopups.insertOne({
    id,
    type,
    playerA: {
      name: a.value.name,
      avatarId: 1,
      level: a.value.level,
      elo: a.value.elo,
      hasAccepted: false
    },
    playerB: {
      name: b.value.name,
      avatarId: 1,
      level: b.value.level,
      elo: b.value.elo,
      hasAccepted: false
    }
  });

  if (!inserted.insertedId) {
    return;
  }

  const acceptTimeout = setTimeout(async () => {
    const $gamePopup = await gamePopups.findOne({id});
    if (!$gamePopup) { return; }
    if (!$gamePopup.playerA.hasAccepted || !$gamePopup.playerB.hasAccepted) {
      
      const pa = await players.findOneAndUpdate({
        name: $gamePopup.playerA.name
      }, {
        $set: {
          status: PlayerStatus.ONLINE,
          gamePopupId: 0
        }
      });
      const pb = await players.findOneAndUpdate({
        name: $gamePopup.playerB.name
      }, {
        $set: {
          status: PlayerStatus.ONLINE,
          gamePopupId: 0
        }
      });

      if (!pa.value || !pb.value) { return; }

await gamePopups.deleteOne({id});

      io.to(pa.value.socketId).emit("declineGameSender");
      io.to(pb.value.socketId).emit("declineGameReceiver");
    }
  }, 10_000);

  io.to(a.value.socketId).emit("gamePopup" as any);
  io.to(b.value.socketId).emit("gamePopup" as any);
};

export {gamePopup};
