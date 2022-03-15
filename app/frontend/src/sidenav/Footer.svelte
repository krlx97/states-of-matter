<script lang="ts">
  import Button from "../ui/Button.svelte";
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .footer {
    padding: $spacing-md;
    @include flex($align-items: center, $justify-content: space-evenly);
    border-top: 2px solid $light-grey;
    box-sizing: border-box;
  }
</style>

<div class="footer">
  <Button style="outlined" color="purple">DISCUSSIONS</Button>
  <Button style="outlined" color="purple">DISCORD</Button>
</div>
