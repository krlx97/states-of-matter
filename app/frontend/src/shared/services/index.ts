import {CryptoService} from "./CryptoService";
import {EccService} from "./EccService";
import {MiscService} from "./MiscService";
import {SocketService} from "./SocketService";

const cryptoService = new CryptoService();
const eccService = new EccService();
const miscService = new MiscService();
const socketService = new SocketService();

export {cryptoService, eccService, miscService, socketService};
