import {authenticate} from "./authenticate";
import {disconnect} from "./disconnect";
import {getNonce} from "./getNonce";
import {signinMetamask} from "./signinMetamask";
import {signinPassword} from "./signinPassword";
import {signupMetamask} from "./signupMetamask";
import {signupPassword} from "./signupPassword";

const auth = [
  authenticate,
  disconnect,
  getNonce,
  signinMetamask,
  signinPassword,
  signupMetamask,
  signupPassword
];

export {auth};
