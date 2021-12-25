import {io} from "socket.io-client";

const socket = io("ws://localhost:4200");

const socketService = {
  emit (event: string, data?: object): void {
    socket.emit(event, data);
  },

  listenToResponses (responses: any): void {
    Object.keys(responses).forEach((response) => {
      socket.on(response, (params = {}) => {
        responses[response](params);
      });
    });
  },

  unlisten (responses: any): void {
    Object.keys(responses).forEach((response) => { socket.off(response); });
  }
}

export default socketService;
