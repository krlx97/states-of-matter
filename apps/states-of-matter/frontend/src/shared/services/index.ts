import {CryptoService} from "./CryptoService";
import {EccService} from "./EccService";
import {MiscService} from "./MiscService";
import {SocketService} from "./SocketService";
import {SoundService} from "./soundService";

const cryptoService = new CryptoService();
const eccService = new EccService();
const miscService = new MiscService();
const socketService = new SocketService();
const soundService = new SoundService();

export {cryptoService, eccService, miscService, socketService, soundService};
