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
    height: 100%;
    padding: $spacing-md;
    @include d-flex(column, initial, initial);

    &__top {
      @include d-flex(row, initial, space-between);
    }

    &__bot {
      margin-bottom: $spacing-md;
      @include d-grid(7, 1, 0 1em);
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
    <OpponentMinionField field="a"/>
    <OpponentMinionField field="b"/>
    <OpponentHero/>
    <OpponentMinionField field="c"/>
    <OpponentMinionField field="d"/>
    <OpponentMagicField/>
  </div>
</div>
