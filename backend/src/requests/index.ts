import {auth} from "./auth";
import {client} from "./client";
import {game} from "./game";
import {sidenav} from "./sidenav";

const requests = [...auth, ...client, ...game, ...sidenav];

export {requests};
