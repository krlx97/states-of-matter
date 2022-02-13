<script lang="ts">
  import Avatar from "./Avatar.svelte";

  const avatarsIds = [0, 1, 2, 3, 4];
</script>

<style lang="scss">
  @import "../../../shared/styles/mixins";
  @import "../../../shared/styles/variables";

  .avatars {
    padding: $spacing-md 0 0 $spacing-md;
    @include flex();
    flex-wrap: wrap;
    box-sizing: border-box;
  }
</style>

<div class="avatars">
  {#each avatarsIds as avatarId}
    <Avatar {avatarId}/>
  {/each}
</div>
