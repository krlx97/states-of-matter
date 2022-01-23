import {io} from "socket.io-client";
import {SocketEvent} from "@som/shared/enums";

import type {
  AcceptFriendReq,
  AddFriendReq,
  AttackCardReq,
  BlockReq,
  DeclineFriendReq,
  GetPrivateKeyHashReq,
  JoinLobbyReq,
  PlayCardReq,
  SaveDeckReq,
  SelectDeckReq,
  SendChatMsgReq,
  SetAvatarReq,
  SetDeckKlassReq,
  SetDeckNameReq,
  SigninReq,
  SignupReq,
  StartGameReq,
  UnblockReq,
  UnfriendReq
} from "@som/shared/interfaces/requests";

class SocketService {
  private readonly _socket = io("ws://localhost:4200");
  // ------------------------------ AUTH ------------------------------
  public getPrivateKeyHash (params: GetPrivateKeyHashReq): void {
    this._socket.emit(SocketEvent.GET_PRIVATE_KEY_HASH, params);
  }
  public signin (params: SigninReq): void {
    this._socket.emit(SocketEvent.SIGNIN, params);
  }
  public signup (params: SignupReq): void {
    this._socket.emit(SocketEvent.SIGNUP, params);
  }
  // ------------------------------ CLIENT ------------------------------
  public setAvatar (params: SetAvatarReq): void {
    this._socket.emit(SocketEvent.SET_AVATAR, params);
  }
  public setDeckName (params: SetDeckNameReq): void {
    this._socket.emit(SocketEvent.SET_DECK_NAME, params);
  }
  public joinLobby (params: JoinLobbyReq): void {
    this._socket.emit(SocketEvent.JOIN_LOBBY, params);
  }
  public makeLobby (): void {
    this._socket.emit(SocketEvent.MAKE_LOBBY);
  }
  public selectDeck (params: SelectDeckReq): void {
    this._socket.emit(SocketEvent.SELECT_DECK, params);
  }
  public saveDeck (params: SaveDeckReq): void {
    this._socket.emit(SocketEvent.SAVE_DECK, params);
  }
  public setDeckKlass (params: SetDeckKlassReq): void {
    this._socket.emit(SocketEvent.SET_DECK_KLASS, params);
  }
  public startGame (params: StartGameReq): void {
    this._socket.emit(SocketEvent.START_GAME, params);
  }
  public destroyLobby (): void {
    this._socket.emit(SocketEvent.DESTROY_LOBBY);
  }
  public leaveLobby (): void {
    this._socket.emit(SocketEvent.LEAVE_LOBBY);
  }
  // ------------------------------ GAME ------------------------------
  public attackCard (params: AttackCardReq): void {
    this._socket.emit(SocketEvent.ATTACK_CARD, params);
  }
  public playCard (params: PlayCardReq): void {
    this._socket.emit(SocketEvent.PLAY_CARD, params);
  }
  public endTurn (): void {
    this._socket.emit(SocketEvent.END_TURN);
  }
  // ------------------------------ SIDENAV ------------------------------
  public addFriend (params: AddFriendReq): void {
    this._socket.emit(SocketEvent.ADD_FRIEND, params);
  }
  public acceptFriend (params: AcceptFriendReq): void {
    this._socket.emit(SocketEvent.ACCEPT_FRIEND, params);
  }
  public declineFriend (params: DeclineFriendReq): void {
    this._socket.emit(SocketEvent.DECLINE_FRIEND, params);
  }
  public blockFriend (params: BlockReq): void {
    this._socket.emit(SocketEvent.BLOCK_FRIEND, params);
  }
  public unblockFriend (params: UnblockReq): void {
    this._socket.emit(SocketEvent.UNBLOCK_FRIEND, params);
  }
  public unfriend (params: UnfriendReq): void {
    this._socket.emit(SocketEvent.UNFRIEND, params);
  }
  public signout (): void {
    this._socket.emit(SocketEvent.SIGNOUT);
  }
  // ------------------------------ GLOBAL ------------------------------
  public updateStatus (): void {
    this._socket.emit(SocketEvent.UPDATE_FRIEND);
  }
  public sendChatMsg (params: SendChatMsgReq): void {
    this._socket.emit(SocketEvent.SEND_CHAT_MSG, params);
  }

  public listen (responses: object): void {
    Object.keys(responses).forEach((response) => {
      this._socket.on(response, (params) => {
        responses[response](params);
      });
    });
  }

  public forget (responses: object): void {
    Object.keys(responses).forEach((response) => {
      this._socket.off(response);
    });
  }
}

const socketService = new SocketService();

export default socketService;
