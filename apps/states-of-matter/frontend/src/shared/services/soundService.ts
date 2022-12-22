interface Sounds {
  attack: HTMLAudioElement;
  summon: HTMLAudioElement;
}

class SoundService {
  public readonly sounds: Sounds = {
    attack: new Audio("assets/sounds/attack.mp3"),
    summon: new Audio("assets/sounds/summon.mp3")
  };

  public play (sound: keyof Sounds): void {
    this.sounds[sound].play();
  }
}

export {SoundService};
