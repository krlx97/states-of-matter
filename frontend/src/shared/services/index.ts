import {EthersService} from "./EthersService";
import {ModalService} from "./ModalService";
import {NotificationService} from "./NotificationService";
import {SocketService} from "./SocketService";
import {SoundService} from "./soundService";

const ethersService = new EthersService();
const modalService = new ModalService();
const notificationService = new NotificationService();
const socketService = new SocketService();
const soundService = new SoundService();

export {
  ethersService,
  modalService,
  notificationService,
  socketService,
  soundService
};
