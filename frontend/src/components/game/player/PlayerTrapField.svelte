<script lang="ts">
  import {CardType} from "enums";
  import {selectedHandCard} from "../stores";
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .field {
    height: calc($game-card-height + 32px);
    width: $game-card-width;
    @include d-flex(row, center, center);
    background-color: $red;
    box-shadow: $elevation-sm;
  }

  .summonable {
    animation: glow 1s ease-in-out infinite;
  }
  @keyframes glow {
    0% {
      box-shadow: 0 0 0 0 rgba(var(--red), 0.4);
    }
    70% {
        box-shadow: 0 0 0 10px rgba(var(--red), 0);
    }
    100% {
        box-shadow: 0 0 0 0 rgba(var(--red), 0);
    }
  }
</style>

<div
  class="field"
  class:summonable={$selectedHandCard.gid !== 0 && $selectedHandCard.type === CardType.TRAP}>
  <span>Trap Field</span>
</div>
