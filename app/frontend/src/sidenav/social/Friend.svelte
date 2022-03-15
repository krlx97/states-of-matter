<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {socialStore} from "stores/view";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import type {Friend} from "models/view/Social";

  import Button from "../../ui/Button.svelte";
  import Text from "../../ui/Text.svelte";

  let friend: Friend;

  const onChat = (): void => {
    const {username, status, avatarId, messages} = friend;

    if ($socialStore.chat.username === username) {
      $socialStore.chat.isOpen = true;
    } else {
      const isOpen = true;
      $socialStore.chat = {username, status, avatarId, isOpen, messages};
    }
  };

  export {friend};
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .friend {
    margin: $spacing-md;
    padding: $spacing-md;
    display: flex;
    flex-direction: column;
    background-color: $light-grey;
    border-radius: 4px;
    box-shadow: $elevation-sm;
  }

  .friend__main {
    display: flex;
    align-items: center;
  }
  .friend__main__avatar {
    height: 64px;
    width: 64px;
    overflow: hidden;
  }
  .friend__main__avatar__img {
    height: 64px;
    width: 64px;
    border-radius: 50%;
  }
  .friend__main__info {
    margin-left: $spacing-sm;
    flex-grow: 1;
  }
  .friend__main__info__username {
    margin-bottom: $spacing-xsm;
  }
</style>

<div class="friend">

  <div class="friend__main">

    <div class="friend__main__avatar">
      <img
        class="friend__main__avatar__img"
        src="assets/avatars/{friend.avatarId}.png"
        alt="{friend.username} avatar">
    </div>

    <div class="friend__main__info">
      <Text>
        {friend.username}
      </Text>
      <Text>
        {#if friend.status === PlayerStatus.OFFLINE}
          <Text color="grey"><FontAwesome icon="circle"/> Offline</Text>
        {:else if friend.status === PlayerStatus.ONLINE}
          <Text color="green"><FontAwesome icon="circle"/> Online</Text>
        {:else if friend.status === PlayerStatus.INLOBBY}
          <Text color="blue"><FontAwesome icon="circle"/> In lobby</Text>
        {:else if friend.status === PlayerStatus.INGAME}
          <Text color="orange"><FontAwesome icon="circle"/> In game</Text>
        {/if}
      </Text>
    </div>

    <Button style="icon" on:click={onChat}>
      <FontAwesome icon="comment"/>
    </Button>

  </div>
</div>
