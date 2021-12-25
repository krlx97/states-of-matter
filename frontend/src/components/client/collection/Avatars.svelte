<script lang="ts">
  import {socketService} from "services";
  import {playerStore} from "stores/data";

  const avatars = [0, 1, 2];

  const selectAvatar = (avatarId: number): void => {
    socketService.emit("setAvatar", {avatarId});
  };
</script>

<style lang="scss">
  @import "../../../styles/variables";

  .avatars {
    display: flex;
    padding: 8px 0 0 8px;
    box-sizing: border-box;
  }
  .avatar, .avatar__img {
    height: 64px;
    width: 64px;
    margin: 0 8px 8px 0;
    border-radius: 50%;
  }
  .avatar:hover {
    box-shadow: 0 0 4px 0 $purple;
    cursor: pointer;
  }
  .selected {
    box-shadow: 0 0 4px 0 $purple;
  }
</style>

<div class="avatars">
  {#each avatars as avatar}
    <div
      class="avatar"
      class:selected={$playerStore.avatarId === avatar}
      on:click={() => selectAvatar(avatar)}
    >
      <img class="avatar__img" src="/assets/avatars/{avatar}.jpg" alt="Avatar {avatar}"/>
    </div>
  {/each}
</div>
