<script lang="ts">
  import Deck from "../Deck.svelte";
  import PlayerGraveyard from "./PlayerGraveyard.svelte";
  import PlayerHero from "./PlayerHero.svelte";
  import PlayerMagicField from "./PlayerMagicField.svelte";
  import PlayerMinionField from "./PlayerMinionField.svelte";
  import PlayerTrapField from "./PlayerTrapField.svelte";
  import PlayerHandCards from "./PlayerHandCards.svelte";
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .fields {
    position: relative;
    @include d-flex(column, initial, initial);

    &__top {
      margin-bottom: $spacing-sm;
      @include d-grid(7, 1, 0 $spacing-sm);
    }

    &__bot {
      @include d-flex(row, initial, space-between);
    }
  }
</style>

<div class="fields">
  <div class="fields__top">
    <PlayerMagicField/>
    <PlayerMinionField field="A"/>
    <PlayerMinionField field="B"/>
    <PlayerHero/>
    <PlayerMinionField field="C"/>
    <PlayerMinionField field="D"/>
    <PlayerTrapField/>
  </div>
  <div class="fields__bot">
    <PlayerGraveyard/>
    <PlayerHandCards/>
    <Deck/>
  </div>
</div>
