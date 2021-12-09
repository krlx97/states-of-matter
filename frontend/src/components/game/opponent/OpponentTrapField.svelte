<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .trapfield {
    height: $game-field-height;
    width: $game-field-width;
    @include d-flex(row, center, center);
    border: 2px solid $red;
    box-sizing: border-box;
  }
</style>

<div class="trapfield">
  <span class="f--red">Trap Field</span>
</div>