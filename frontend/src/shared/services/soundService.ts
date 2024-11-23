const sounds = {
  attack: new Audio("sounds/attack.mp3"),
  card: new Audio("sounds/card.mp3"),
  duelDecline: new Audio("sounds/duel-decline.mp3"), //
  duelFound: new Audio("sounds/duel-found.mp3"), //
  duelStart: new Audio("sounds/duel-start.mp3"), //
  click: new Audio("sounds/click.mp3"),
  endTurn: new Audio("sounds/endTurn.mp3"),
  directAttack: new Audio("sounds/directAttack.mp3"),
  death: new Audio("sounds/death.mp3"),
  attributeChange: new Audio("sounds/attribute-change.mp3"),
  message: new Audio("sounds/message.mp3"),
  TAB: new Audio("sounds/TAB.mp3"),
  summon: new Audio("sounds/summon.mp3"),
  notification: new Audio("sounds/notification.mp3"),
  skinReveal: new Audio("sounds/skin-reveal.mp3"),
  magic: new Audio("sounds/magic.mp3"),
  trap: new Audio("sounds/trap.mp3"),
  effect: new Audio("sounds/effect.mp3"),
};

const setVolume = (volume: number): void => {
  (Object.keys(sounds) as Array<keyof typeof sounds>).forEach((key): void => {
    sounds[key].volume = volume;
  });
};

setVolume(0.25);

const play = (sound: keyof typeof sounds): void => {
  sounds[sound].play();
}

const soundService = {play};

export {soundService};
