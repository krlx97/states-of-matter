<script lang="ts">
  import {hoveredCardStore} from "game/stores";

  $: isHovered = "magic" === $hoveredCardStore.field;
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .isHovered { box-shadow: 0 0 4px 8px white; }

  .field {
    height: $card-height;
    width: $card-width;
    @include flex($align-items: center, $justify-content: center);
    border: 2px solid $green;
    box-sizing: border-box;
    color: white;
  }
</style>

<div class="field" class:isHovered>
  <span class="f--green">Magic Field</span>
</div>
