<script lang="ts">
  import {gameStore, playerStore} from "stores";
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

  .fields-wrapper {
    position: relative;
    height: 50%;
    @include flex($align-items: center, $justify-content: center);
    overflow: hidden;
  }
  .fields {
    @include grid(7, 1, 0 $spacing-sm);
  }
  .turn {
    position: absolute;
    top: 50%;
    left: 105%;
  }
</style>

<div class="fields-wrapper">
  <div class="fields">
    <OpponentDeck/>
    <!-- <OpponentMinionField field="F"/>
    <OpponentMinionField field="E"/> -->
    <OpponentMinionField field="D"/>
    <OpponentMinionField field="C"/>
    <OpponentHero/>
    <OpponentMinionField field="B"/>
    <OpponentMinionField field="A"/>
    <OpponentGraveyard/>
  </div>

  <OpponentHandCards/>

  {#if $gameStore.currentPlayer !== $playerStore.username}
    <div class="turn">
      <i class="fas fa-arrow-left"></i>
    </div>
  {/if}
</div>
