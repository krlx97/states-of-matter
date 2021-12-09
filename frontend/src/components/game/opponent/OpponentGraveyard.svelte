<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .graveyard {
    height: $game-field-height;
    width: $game-field-width;
    @include d-flex(row, center, center);
    border: 2px solid $purple;
    box-shadow: $elevation-sm;
    color: white;
  }
</style>

<div class="graveyard">
  Graveyard
</div>