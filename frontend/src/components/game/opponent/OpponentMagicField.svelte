<style lang="scss">
  @import "../../../styles/mixins";
  @import "../../../styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include d-flex(row, center, center);
    border: 2px solid $green;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="field">
  <span class="f--green">Magic Field</span>
</div>
