<script lang="ts">
  import {playerStore} from "stores/data";
  import {gameStore} from "game/stores";

  import OpponentDeck from "./OpponentDeck.svelte";
  import OpponentGraveyard from "./OpponentGraveyard.svelte";
  import OpponentHandCards from "./OpponentHandCards.svelte";
  import OpponentHero from "./OpponentHero.svelte";
  import OpponentMagicField from "./OpponentMagicField.svelte";
  import OpponentMinionField from "./OpponentMinionField.svelte";
  import OpponentTrapField from "./OpponentTrapField.svelte";
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .fields {
    position: relative;
    margin-bottom: $spacing-sm;
    @include flex(column);

    &__top {
      margin-bottom: $spacing-sm;
      @include flex($justify-content: space-between);
    }

    &__bot {@include d-grid(7, 1, 0 $spacing-sm)}

    &__turn {
      position: absolute;
      top: 50%;
      left: 105%;
    }
  }
</style>

<div class="fields">
  <div class="fields__top">
    <OpponentDeck/>
    <OpponentHandCards/>
    <OpponentGraveyard/>
  </div>
  <div class="fields__bot">
    <OpponentTrapField/>
    <OpponentMinionField field="D"/>
    <OpponentMinionField field="C"/>
    <OpponentHero/>
    <OpponentMinionField field="B"/>
    <OpponentMinionField field="A"/>
    <OpponentMagicField/>
  </div>

  {#if $gameStore.currentPlayer !== $playerStore.username}
    <div class="fields__turn">
      <i class="fas fa-arrow-left"></i>
    </div>
  {/if}
</div>
