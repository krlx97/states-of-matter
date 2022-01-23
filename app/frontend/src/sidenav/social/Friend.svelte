<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {socialStore} from "stores/view";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import type {Friend} from "models/view/Social";

  let friend: Friend;
  let isActionsVisible = false;

  const onToggleActions = (): void => {
    isActionsVisible = !isActionsVisible;
  };

  const onChat = (): void => {
    const {username, status, avatarId, messages} = friend;

    isActionsVisible = !isActionsVisible;

    if ($socialStore.chat.username === username) {
      $socialStore.chat.isOpen = true;
    } else {
      const isOpen = true;
      $socialStore.chat = {username, status, avatarId, isOpen, messages};
    }
  };

  export {friend};
</script>

<style>
  .friend {
    margin-bottom: var(--spacing-sm);
    padding: var(--spacing-sm);
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-shadow: var(--elevation-sm);
  }
  .friend:nth-last-child(1) {
    margin-bottom: 0;
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
    margin-left: var(--spacing-sm);
    flex-grow: 1;
  }
  .friend__main__info__username {
    margin-bottom: var(--spacing-xsm);
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
      <p class="friend__main__info__username">
        {friend.username}
      </p>
      <p>
        {#if friend.status === PlayerStatus.OFFLINE}
          <span class="f--grey"><FontAwesome icon="circle"/> Offline</span>
        {:else if friend.status === PlayerStatus.ONLINE}
          <span class="f--green"><FontAwesome icon="circle"/> Online</span>
        {:else if friend.status === PlayerStatus.INLOBBY}
          <span class="f--blue"><FontAwesome icon="circle"/> In lobby</span>
        {:else if friend.status === PlayerStatus.INGAME}
          <span class="f--orange"><FontAwesome icon="circle"/> In game</span>
        {/if}
      </p>
    </div>

    <button class="btn--icon" on:click={onChat}>
      <FontAwesome icon={isActionsVisible ? "times" : "comment"}/>
    </button>

  </div>
</div>
