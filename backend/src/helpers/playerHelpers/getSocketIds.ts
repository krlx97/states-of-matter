import {mongo} from "app";

const getSocketIds = async (players: string[]): Promise<string[]> => {
  return await mongo
    .$players
    .find({name: {$in: players}})
    .project({_id: 0, socketId: 1})
    .map(({socketId}) => socketId)
    .toArray();
};

export {getSocketIds};
