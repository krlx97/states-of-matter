<script lang="ts">
  import {CardType} from "enums";
  import {selectedHandCard} from "game/stores";

  $: summonable = $selectedHandCard.gid !== 0 && $selectedHandCard.type === CardType.MAGIC;
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    background-color: $green;
    box-shadow: $elevation-sm;
  }

  .summonable {animation: glow 900ms $ease-in-out-quart infinite}

  @keyframes glow {
    0%    {box-shadow: 0 0 4px 2px $green}
    50%   {box-shadow: 0 0 8px 4px $green}
    100%  {box-shadow: 0 0 4px 2px $green}
  }
</style>

<div class="field" class:summonable>
  <span>Magic Field</span>
</div>
