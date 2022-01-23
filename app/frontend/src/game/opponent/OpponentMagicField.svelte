<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    border: 2px solid $green;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="field">
  <span class="f--green">Magic Field</span>
</div>
