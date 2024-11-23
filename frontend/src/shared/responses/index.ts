import {authResponses} from "./auth";
import {clientResponses} from "./client";
import {gameResponses} from "./game";
import {notification} from "./global";
import {sidenav} from "./sidenav";

const responses = [
  ...authResponses,
  ...clientResponses,
  ...gameResponses,
  ...sidenav,
  notification
];

export {responses};
