<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .graveyard {
    height: calc($game-card-height + 32px);
    width: $game-card-width;
    @include d-flex(row, center, center);
    border: 2px solid $purple;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="graveyard">
  Graveyard
</div>