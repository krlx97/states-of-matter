<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .magic {
    height: $game-field-height;
    width: $game-field-width;
    @include d-flex(row, center, center);
    border: 2px solid $green;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="magic">
  <span class="f--green">Magic Field</span>
</div>