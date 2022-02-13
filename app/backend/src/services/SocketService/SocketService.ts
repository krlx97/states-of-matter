import {SocketEvent} from "@som/shared/enums";
import Service from "../Service.js";

import type {Player} from "../PlayerService/PlayerService.models";
import type {
  GetPrivateKeyHashRes,
  SigninRes,
  UpdateFriendRes,
  NotificationRes,
  JoinLobbySenderRes,
  JoinLobbyReceiverRes,
  MakeLobbyRes,
  SaveDeckRes,
  SelectDeckRes,
  SetDeckKlassRes,
  SetDeckNameRes,
  StartGameRes,
  AttackCardSenderRes,
  AttackCardReceiverRes,
  PlayCardSenderRes,
  PlayCardReceiverRes,
  AcceptFriendReceiverRes,
  AcceptFriendSenderRes,
  AddFriendRes,
  BlockSenderRes,
  BlockReceiverRes,
  DeclineFriendRes,
  SetAvatarReceiverRes,
  SetAvatarSenderRes,
  UnblockRes,
  UnfriendReceiverRes,
  UnfriendSenderRes,
  SendChatMsgReceiverRes,
  SendChatMsgSenderRes,
  HoverCardRes
} from "@som/shared/interfaces/responses";


interface SocketEvents {
  // ------------------------------ GLOBAL ------------------------------
  notification (params: NotificationRes): void;
  sendChatMsgReceiver (params: SendChatMsgReceiverRes): void;
  sendChatMsgSender (params: SendChatMsgSenderRes): void;
  updateFriend (params: UpdateFriendRes): void;
  // ------------------------------ AUTH ------------------------------
  getPrivateKeyHash (params: GetPrivateKeyHashRes): void;
  signin (params: SigninRes): void;
  // ------------------------------ CLIENT ------------------------------
  destroyLobby (): void;
  joinLobbyReceiver (params: JoinLobbyReceiverRes): void;
  joinLobbySender (params: JoinLobbySenderRes): void;
  leaveLobbyReceiver (): void;
  leaveLobbySender (): void;
  makeLobby (params: MakeLobbyRes): void;
  saveDeck (params: SaveDeckRes): void;
  selectDeck (params: SelectDeckRes): void;
  setDeckKlass (params: SetDeckKlassRes): void;
  setDeckName (params: SetDeckNameRes): void;
  startGame (params: StartGameRes): void;
  // ------------------------------ GAME ------------------------------
  attackCardReceiver (params: AttackCardReceiverRes): void;
  attackCardSender (params: AttackCardSenderRes): void;
  endTurnOpponent (): void;
  endTurnPlayer (): void;
  hoverCard (params: HoverCardRes): void;
  unhoverCard (): void;
  playCardReceiver (params: PlayCardReceiverRes): void;
  playCardSender (params: PlayCardSenderRes): void;
  endGame (): void;
  // ------------------------------ SIDENAV ------------------------------
  acceptFriendReceiver (params: AcceptFriendReceiverRes): void;
  acceptFriendSender (params: AcceptFriendSenderRes): void;
  addFriend (params: AddFriendRes): void;
  blockFriendReceiver (params: BlockReceiverRes): void;
  blockFriendSender (params: BlockSenderRes): void;
  declineFriend (params: DeclineFriendRes): void;
  setAvatarReceiver (params: SetAvatarReceiverRes): void;
  setAvatarSender (params: SetAvatarSenderRes): void;
  unblockFriend (params: UnblockRes): void;
  unfriendReceiver (params: UnfriendReceiverRes): void;
  unfriendSender (params: UnfriendSenderRes): void;
}


class SocketService extends Service {
  public get socketId (): string { return this._apis.socket.id; }

  public async getSocketIds(players: string[]): Promise<string[]> {
    let socketIds!: Array<string>;

    try {
      socketIds = await this._apis.mongo.collection<Player>("players")
        .find({username: {$in: players}})
        .project<Player>({_id: 0, socketId: 1})
        .map(({socketId}) => socketId)
        .toArray();
    } catch (error) {
      this._handleError(error);
    }

    return socketIds;
  }

  public emit (room?: string | Array<string>): SocketEvents {
    const {socket, io} = this._apis;
    let emitter: any;

    if (room === undefined) {
      emitter = socket;
    } else {
      emitter = io.to(room);
    }

    return {
      // ------------------------------ GLOBAL ------------------------------
      notification (params)         { emitter.emit(SocketEvent.NOTIFICATION, params);           },
      sendChatMsgReceiver (params)  { emitter.emit(SocketEvent.SEND_CHAT_MSG_RECEIVER, params); },
      sendChatMsgSender (params)    { emitter.emit(SocketEvent.SEND_CHAT_MSG_SENDER, params);   },
      updateFriend (params)         { emitter.emit(SocketEvent.UPDATE_FRIEND, params);          },
      // ------------------------------ AUTH ------------------------------
      getPrivateKeyHash (params)    { emitter.emit(SocketEvent.GET_PRIVATE_KEY_HASH, params);   },
      signin (params)               { emitter.emit(SocketEvent.SIGNIN, params);                 },
      // ------------------------------ CLIENT ------------------------------
      destroyLobby ()               { emitter.emit(SocketEvent.DESTROY_LOBBY);                  },
      joinLobbyReceiver (params)    { emitter.emit(SocketEvent.JOIN_LOBBY_RECEIVER, params);    },
      joinLobbySender (params)      { emitter.emit(SocketEvent.JOIN_LOBBY_SENDER, params);      },
      leaveLobbyReceiver ()         { emitter.emit(SocketEvent.LEAVE_LOBBY_RECEIVER);           },
      leaveLobbySender ()           { emitter.emit(SocketEvent.LEAVE_LOBBY_SENDER);             },
      makeLobby (params)            { emitter.emit(SocketEvent.MAKE_LOBBY, params);             },
      saveDeck (params)             { emitter.emit(SocketEvent.SAVE_DECK, params);              },
      selectDeck (params)           { emitter.emit(SocketEvent.SELECT_DECK, params);            },
      setDeckKlass (params)         { emitter.emit(SocketEvent.SET_DECK_KLASS, params);         },
      setDeckName (params)          { emitter.emit(SocketEvent.SET_DECK_NAME, params);          },
      startGame (params)            { emitter.emit(SocketEvent.START_GAME, params);             },
      // ------------------------------ GAME ------------------------------
      attackCardReceiver (params)   { emitter.emit(SocketEvent.ATTACK_CARD_RECEIVER, params);   },
      attackCardSender (params)     { emitter.emit(SocketEvent.ATTACK_CARD_SENDER, params);     },
      endTurnOpponent ()            { emitter.emit(SocketEvent.END_TURN_OPPONENT);              },
      endTurnPlayer ()              { emitter.emit(SocketEvent.END_TURN_PLAYER);                },
      hoverCard (params)            { emitter.emit(SocketEvent.HOVER_CARD, params);             },
      unhoverCard ()                { emitter.emit(SocketEvent.UNHOVER_CARD); },
      playCardReceiver (params)     { emitter.emit(SocketEvent.PLAY_CARD_RECEIVER, params);     },
      playCardSender (params)       { emitter.emit(SocketEvent.PLAY_CARD_SENDER, params);       },
      endGame ()                    { emitter.emit(SocketEvent.END_GAME);                       },
      // ------------------------------ SIDENAV ------------------------------
      acceptFriendReceiver (params) { emitter.emit(SocketEvent.ACCEPT_FRIEND_RECEIVER, params); },
      acceptFriendSender (params)   { emitter.emit(SocketEvent.ACCEPT_FRIEND_SENDER, params);   },
      addFriend (params)            { emitter.emit(SocketEvent.ADD_FRIEND, params);             },
      blockFriendReceiver (params)  { emitter.emit(SocketEvent.BLOCK_FRIEND_RECEIVER, params);  },
      blockFriendSender (params)    { emitter.emit(SocketEvent.BLOCK_FRIEND_SENDER, params);    },
      declineFriend (params)        { emitter.emit(SocketEvent.DECLINE_FRIEND, params);         },
      setAvatarReceiver (params)    { emitter.emit(SocketEvent.SET_AVATAR_RECEIVER, params);    },
      setAvatarSender (params)      { emitter.emit(SocketEvent.SET_AVATAR_SENDER, params);      },
      unblockFriend (params)        { emitter.emit(SocketEvent.UNBLOCK_FRIEND, params);         },
      unfriendReceiver (params)     { emitter.emit(SocketEvent.UNFRIEND_RECEIVER, params);      },
      unfriendSender (params)       { emitter.emit(SocketEvent.UNFRIEND_SENDER, params);        },
    }
  }
}

export default SocketService;
