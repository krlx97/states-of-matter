const sounds = {
  attack: new Audio("assets/sounds/attack.mp3"),
  summon: new Audio("assets/sounds/summon.mp3"),
  matchFound: new Audio("assets/sounds/match-found.mp3"),
  click: new Audio("assets/sounds/click.mp3"),
  cancel: new Audio("assets/sounds/cancel.mp3"),
  accept: new Audio("assets/sounds/accept.mp3"),
  endTurn: new Audio("assets/sounds/endTurn.mp3"),
  directAttack: new Audio("assets/sounds/directAttack.mp3"),
  death: new Audio("assets/sounds/death.mp3"),
  lifeDeduct: new Audio("assets/sounds/lifeDeduct.mp3"),
};

const setVolume = (volume: number): void => {
  (Object.keys(sounds) as Array<keyof typeof sounds>).forEach((key) => {
    sounds[key].volume = volume;
  });
};

setVolume(0.25);

const play = (sound: keyof typeof sounds): void => {
  sounds[sound].play();
}

const soundService = {play};

export {soundService};
