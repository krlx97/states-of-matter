<script lang="ts">
  import {hoveredCardStore} from "stores";

  $: isHovered = "trap" === $hoveredCardStore.field;
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .isHovered { box-shadow: 0 0 4px 8px white; }

  .field {
    height: $card-height-sm;
    width: $card-width-sm;
    @include flex($align-items: center, $justify-content: center);
    border: 2px solid $red;
    box-sizing: border-box;
    overflow: hidden;
  }
</style>

<div class="field" class:isHovered>
  <span class="f--red">Trap Field</span>
</div>
