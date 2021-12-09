<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .field {
    height: $game-field-height;
    width: $game-field-width;
    @include d-flex(row, center, center);
    background-color: $green;
    box-shadow: $elevation-sm;
  }
</style>

<div class="field">
  <span>Magic Field</span>
</div>