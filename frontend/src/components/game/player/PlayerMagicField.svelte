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
    background-color: $green;
    box-shadow: $elevation-sm;
  }

  .summonable {
    animation: glow 1s ease-in-out infinite;
  }
  @keyframes glow {
    0% {
      box-shadow: 0 0 0 0 rgb(var(--green));
    } 50% {
      box-shadow: 0 0 4px 2px rgb(var(--green));
    } 100% {
      box-shadow: 0 0 0 0 rgb(var(--green));
    }
  }
</style>

<div
  class="field"
  class:summonable={$selectedHandCard.gid !== 0 && $selectedHandCard.type === CardType.MAGIC}>
  <span>Magic Field</span>
</div>
