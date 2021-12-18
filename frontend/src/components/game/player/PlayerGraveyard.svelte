<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .graveyard {
    height: calc($game-card-height + 32px);
    width: $game-card-width;
    @include d-flex(row, center, center);
    background-color: $purple;
    box-shadow: $elevation-sm;
    color: white;
  }
</style>

<div class="graveyard">
  Graveyard
</div>