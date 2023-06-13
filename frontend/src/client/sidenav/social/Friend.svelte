<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {accountStore} from "stores";
  import type {Friend} from "@som/shared/types/frontend";

  let friend: Friend;

  const onChat = (): void => {
    const {name, status, avatarId, messages} = friend;

    if ($accountStore.social.chat.name === name) {
      $accountStore.social.chat.isOpen = true;
    } else {
      const isOpen = true;
      $accountStore.social.chat = {name, status, avatarId, isOpen, messages};
    }
  };

  export {friend};
</script>

<style>
  .friend {
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    /* background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    ); */
    /* border: 1px solid;
    border-right-width: 0;
    border-left-width: 0;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1; */
    background-image: url(assets/avatars/11.png);
    border-radius: 6px;
  }

  .friend__info {
    margin-left: var(--spacing-sm);
    flex-grow: 1;
    line-height: 1.4;
  }
</style>

<div class="friend">
  <img src="assets/avatars/{friend.avatarId}.png" alt="{friend.name}'s avatar"/>

  <div class="friend__info">
    {friend.name}<br/>
    {#if friend.status === PlayerStatus.OFFLINE}
      <i class="fa-solid fa-circle grey"></i> Offline
    {:else if friend.status === PlayerStatus.ONLINE}
      <i class="fa-solid fa-circle green"></i> Online
    {:else if friend.status === PlayerStatus.IN_QUEUE}
      <i class="fa-solid fa-circle blue"></i> In queue
    {:else if friend.status === PlayerStatus.IN_LOBBY}
      <i class="fa-solid fa-circle blue"></i> In lobby
    {:else if friend.status === PlayerStatus.IN_GAME}
      <i class="fa-solid fa-circle purple"></i> In game
    {/if}
  </div>

  <button class="button--icon" on:click={onChat}>
    <i class="fa-solid fa-comment"></i>
  </button>
</div>
