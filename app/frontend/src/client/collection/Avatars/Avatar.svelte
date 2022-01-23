<script lang="ts">
  import {socketService} from "services";
  import {playerStore} from "stores/data";

  import Img from "../../../ui/Img.svelte";

  let avatarId: number;

  $: isSelected = $playerStore.avatarId === avatarId;

  const onSetAvatar = (): void => { socketService.setAvatar({avatarId}); };

  export {avatarId};
</script>

<style lang="scss">
  @import "../../../shared/styles/variables";

  .isSelected {box-shadow: 0 0 4px 0 $purple}

  .avatar {
    margin: 0 $spacing-sm $spacing-sm 0;
    border-radius: 50%;

    &:hover {
      box-shadow: 0 0 4px 0 $purple;
      cursor: pointer;
    }
  }
</style>

<div class="avatar" class:isSelected on:click={onSetAvatar}>
  <Img src="avatars/{avatarId}.png" alt="Avatar {avatarId}"/>
</div>
