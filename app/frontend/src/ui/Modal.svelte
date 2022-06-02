<script lang="ts">
  import {miscService} from "services";

  const onExit = () => { miscService.closeModal(); };
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .wrapper--modal {
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    @include flex($align-items: center, $justify-content: center);
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 100;
  }
  .modal {
    max-width: 640px;
    padding: $spacing-md;
    background-color: $light-grey;
    border-radius: 4px;
    box-shadow: $elevation-lg;
    z-index: 101;
  }
</style>

<div class="wrapper--modal" on:click|self={onExit}>
  <div class="modal">
    <slot/>
  </div>
</div>
