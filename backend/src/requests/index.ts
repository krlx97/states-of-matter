import {auth} from "./auth";
import {client} from "./client";
import {game} from "./game";

const requests = [...auth, ...client, ...game];

export {requests};
