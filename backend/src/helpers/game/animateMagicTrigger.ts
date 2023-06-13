import { mongo, server } from "apis";
import type {Game} from "@som/shared/types/backend";

const animateMagicTrigger = async (game: Game, username: string, card: any) => {
    const { players } = mongo;
    const { io } = server;
    const { playerA, playerB } = game;
    const [$playerA, $playerB] = await Promise.all([
        players.findOne({
            name: playerA.name
        }),
        players.findOne({
            name: playerB.name
        })
    ]);
    if (!$playerA || !$playerB) {
        console.error("Animate magic trigger failed fetching players.");
        return;
    }
    if ($playerA.name === username) {
        io.to($playerA.socketId).emit("animateMagicTrigger" as any, {
            username, card
        });
        io.to($playerB.socketId).emit("animateMagicTrigger" as any, {
            username, card
        });
    }
    else {
        io.to($playerA.socketId).emit("animateMagicTrigger" as any, {
            username, card
        });
        io.to($playerB.socketId).emit("animateMagicTrigger" as any, {
            username, card
        });
    }
};

export {animateMagicTrigger};
