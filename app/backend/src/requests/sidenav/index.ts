import {acceptFriend} from "./acceptFriend";
import {addFriend} from "./addFriend";
import {block} from "./block";
import {declineFriend} from "./declineFriend";
import {sendChatMsg} from "../sidenav/sendChatMsg";
import {setAvatar} from "./setAvatar";
import {signout} from "./signout";
import {unblock} from "./unblock";
import {unfriend} from "./unfriend";
import {updateStatus} from "../sidenav/updateStatus";

const sidenav = [
  acceptFriend,
  addFriend,
  block,
  declineFriend,
  sendChatMsg,
  setAvatar,
  signout,
  unblock,
  unfriend,
  updateStatus
];

export {sidenav};
