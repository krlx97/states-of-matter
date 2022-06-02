import {disconnect} from "./disconnect";
import {getPrivateKeyHash} from "./getPrivateKeyHash";
import {signin} from "./signin";
import {signup} from "./signup";

const auth = [disconnect, getPrivateKeyHash, signin, signup];

export {auth};
