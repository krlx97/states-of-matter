<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {socketService} from "services";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import Text from "../../ui/Text.svelte";

  $: isSummonable = $selectedCardStore.hand.gid !== 0 && $selectedCardStore.hand.type === CardType.MAGIC;
  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;

  const onMouseEnter = (): void => {
    if (isCurrentPlayer) { socketService.socket.emit("hoverCard", {field: "magic"}); }
  }
  const onMouseLeave = (): void => {
    if (isCurrentPlayer) { socketService.socket.emit("unhoverCard"); }
  }
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

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

<div class="field" class:isSummonable on:mouseenter={onMouseEnter} on:mouseleave={onMouseLeave}>
  <Text>Magic Field</Text>
</div>
