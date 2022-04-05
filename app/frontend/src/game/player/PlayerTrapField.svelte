<script lang="ts">
  import {CardType} from "@som/shared/enums";
  import {gameStore, selectedCardStore, playerStore} from "stores";
  import {socketService} from "services";

  $: isCurrentPlayer = $gameStore.currentPlayer === $playerStore.username;
  $: isSummonable = $selectedCardStore.hand.gid !== 0 && $selectedCardStore.hand.type === CardType.TRAP;

  const onMouseEnter = () => {
    if (isCurrentPlayer) { socketService.socket.emit("hoverCard", {field: "trap"}); }
  }
  const onMouseLeave = () => {
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
    background-color: $red;
    box-shadow: $elevation-sm;
  }

  .isSummonable {animation: glow 1s $ease-in-out-quart infinite}

  @keyframes glow {
    0%    {box-shadow: 0 0 4px 2px $red}
    50%   {box-shadow: 0 0 8px 4px $red}
    100%  {box-shadow: 0 0 4px 2px $red}
  }
</style>

<div
  class="field"
  class:isSummonable
  on:mouseenter={onMouseEnter}
  on:mouseleave={onMouseLeave}
>
  <span>Trap Field</span>
</div>
