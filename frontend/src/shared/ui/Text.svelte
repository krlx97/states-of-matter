<script lang="ts">
  let color:
    "neutral" |
    "solid" |
    "liquid" |
    "gas" |
    "plasma" |
    "health" |
    "damage" |
    "mana" |
    "common" |
    "uncommon" |
    "rare" |
    "epic" |
    "legendary" |
    "mythic" |
    "primary" |
    "success" |
    "warn";

  export {color};
</script>

<style>
  .neutral {color: rgb(var(--neutral));}
  .solid {color: rgb(var(--solid));}
  .liquid {color: rgb(var(--liquid));}
  .gas {color: rgb(var(--gas));}
  .plasma {color: rgb(var(--plasma));}

  .health {color: rgb(var(--health));}
  .damage {color: rgb(var(--damage));}
  .mana {color: rgb(var(--mana));}

  .common {color: rgb(var(--common));}
  .uncommon {color: rgb(var(--uncommon));}
  .rare {color: rgb(var(--rare));}
  .epic {color: rgb(var(--epic));}
  .legendary {color: rgb(var(--legendary));}
  .mythic {color: rgb(var(--mythic));}

  .primary {color: rgb(var(--primary));}
  .success {color: rgb(var(--success));}
  .warn {color: rgb(var(--warn));}
</style>

<span
  class:neutral="{color === "neutral"}"
  class:solid="{color === "solid"}"
  class:liquid="{color === "liquid"}"
  class:gas="{color === "gas"}"
  class:plasma="{color === "plasma"}"
  class:health="{color === "health"}"
  class:damage="{color === "damage"}"
  class:mana="{color === "mana"}"
  class:common="{color === "common"}"
  class:uncommon="{color === "uncommon"}"
  class:rare="{color === "rare"}"
  class:epic="{color === "epic"}"
  class:legendary="{color === "legendary"}"
  class:mythic="{color === "mythic"}"
  class:primary="{color === "primary"}"
  class:success="{color === "success"}"
  class:warn="{color === "warn"}">
  <slot/>
</span>
