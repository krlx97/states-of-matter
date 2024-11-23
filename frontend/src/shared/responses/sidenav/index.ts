
import {addFriendReceiver} from "./addFriendReceiver";
import {addFriendSender} from "./addFriendSender";
import {removeFriendReceiver} from "./removeFriendReceiver";
import {removeFriendSender} from "./removeFriendSender";
import {sendChatMsgReceiver} from "./sendChatMsgReceiver";
import {sendChatMsgSender} from "./sendChatMsgSender";
import {updateFriend} from "./updateFriend";
import {updatePlayer} from "./updatePlayer";

const sidenav = [
  addFriendReceiver,
  addFriendSender,
  removeFriendReceiver,
  removeFriendSender,
  sendChatMsgReceiver,
  sendChatMsgSender,
  updateFriend,
  updatePlayer
];

export {sidenav};
