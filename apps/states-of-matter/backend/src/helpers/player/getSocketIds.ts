import {playersDb} from "apis/mongo";

const getSocketIds = async (players: string[]): Promise<string[]> => {
  return await playersDb
    .find({username: {$in: players}})
    .project({_id: 0, socketId: 1})
    .map(({socketId}) => socketId)
    .toArray();
};

export {getSocketIds};
