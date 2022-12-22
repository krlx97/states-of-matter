import {auth} from "./auth";
import {client} from "./client";
import {game} from "./game";
import {sidenav} from "./sidenav";
import { wallet } from "./sidenav/wallet";

const requests = [...auth, ...client, ...game, ...sidenav, ...wallet];

export {requests};
