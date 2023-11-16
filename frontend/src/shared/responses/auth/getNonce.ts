import {ethersService, socketService} from "services";

const getNonce = (): void => {
  const {socket} = socketService;

  // socket.on("getNonce", async (params) => {
  //   const {nonce} = params;
  //   await ethersService.init();
  //   const data = await ethersService.sign(`signin${nonce}`);

  //   if (!data) { return; }

  //   const {signature, address} = data;

  //   socketService.socket.emit("signinMetamask", {
  //     name: $formStore.fields.name.value, address, signature});
  // })
};

export {getNonce};
