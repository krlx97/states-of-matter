<script lang="ts">
  import {Text} from "components";
  import {CardType} from "enums";
  import {selectedCardStore} from "game/stores";

  $: isSummonable =
    $selectedCardStore.hand.gid !== 0 &&
    $selectedCardStore.hand.type === CardType.MAGIC;
</script>

<style lang="scss">
  @import "../../../../styles/mixins";
  @import "../../../../styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    background-color: $green;
    box-shadow: $elevation-sm;
  }

  .isSummonable {animation: glow 1s $ease-in-out-quart infinite}

  @keyframes glow {
    0%    {box-shadow: 0 0 4px 2px $green}
    50%   {box-shadow: 0 0 8px 4px $green}
    100%  {box-shadow: 0 0 4px 2px $green}
  }
</style>

<div class="field" class:isSummonable>
  <Text>Magic Field</Text>
</div>
