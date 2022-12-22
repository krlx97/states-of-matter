import type {Socket} from "socket.io";
import type {SocketRequests} from "@som/shared/types/requests";
import type {SocketResponses} from "@som/shared/types/responses";

type SocketEvent = (socket: Socket<SocketRequests, SocketResponses>) => void;

export type {SocketEvent};
