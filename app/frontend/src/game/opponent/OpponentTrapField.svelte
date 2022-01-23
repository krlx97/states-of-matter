<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .field {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    border: 2px solid $red;
    box-sizing: border-box;
  }
</style>

<div class="field">
  <span class="f--red">Trap Field</span>
</div>
