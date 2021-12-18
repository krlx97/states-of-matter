<script lang="ts">
  import Deck from "../Deck.svelte";
  import OpponentHero from "./OpponentHero.svelte";
  import OpponentGraveyard from "./OpponentGraveyard.svelte";
  import OpponentHandCards from "./OpponentHandCards.svelte";
  import OpponentMagicField from "./OpponentMagicField.svelte";
  import OpponentMinionField from "./OpponentMinionField.svelte";
  import OpponentTrapField from "./OpponentTrapField.svelte";
</script>

<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .fields {
    position: relative;
    margin-bottom: $spacing-sm;
    @include d-flex(column, initial, initial);

    &__top {
      margin-bottom: $spacing-sm;
      @include d-flex(row, initial, space-between);
    }

    &__bot {
      @include d-grid(7, 1, 0 $spacing-sm);
    }
  }
</style>

<div class="fields">
  <div class="fields__top">
    <Deck/>
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
</div>
