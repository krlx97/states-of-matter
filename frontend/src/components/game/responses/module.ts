import attackCardReceiver from "./attackCardReceiver/attack-card-receiver.response";
import attackCardSender from "./attackCardSender/attack-card-sender.response";
import drawCardReceiver from "./drawCardReceiver/drawCardReceiver.response";
import drawCardSender from "./drawCardSender/drawCardSender.response";
import endGame from "./end-game/end-game.response";
import endTurnOpponent from "./endTurnOpponent/endTurnOpponent";
import endTurnPlayer from "./endTurnPlayer/endTurnPlayer";
import exitGameReceiver from "./exitGameReceiver/exitGameReceiver.response";
import exitGameSender from "./exitGameSender/exitGameSender.response";
import playCardReceiver from "./playCardReceiver/playCardReceiver.response";
import playCardSender from "./playCardSender/playCardSender.response";

const responses = {
  attackCardReceiver,
  attackCardSender,
  drawCardReceiver,
  drawCardSender,
  endGame,
  endTurnOpponent,
  endTurnPlayer,
  exitGameReceiver,
  exitGameSender,
  playCardReceiver,
  playCardSender
};

export default responses;
