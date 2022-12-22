<script lang="ts">
  import {PlayerStatus} from "@som/shared/enums";
  import {socialStore} from "stores";
  import type {Friend} from "../../../shared/models/view/Social";

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

<style>
  .friend {
    margin: var(--spacing-md);
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    /* background-color: rgb(var(--light-grey));
    border-radius: 4px;
    box-shadow: var(--elevation-sm); */

    border-top-width: 1px;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
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
      <div>{friend.username}</div>
      <div>
        {#if friend.status === PlayerStatus.OFFLINE}
          <div>() Offline</div>
        {:else if friend.status === PlayerStatus.ONLINE}
          <div>() Online</div>
        {:else if friend.status === PlayerStatus.INLOBBY}
          <div>() In lobby</div>
        {:else}
          <div>() In game</div>
        {/if}
      </div>
    </div>
    <button class="button--icon" on:click={onChat}>
      <img src="assets/icons/chat.png" alt="Chat"/>
    </button>
  </div>
</div>
