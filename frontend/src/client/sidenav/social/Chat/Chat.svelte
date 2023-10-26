<script lang="ts">
  import {afterUpdate} from "svelte";
  import {fade, slide} from "svelte/transition";
  import {modalService, socketService} from "services";
  import {accountStore} from "stores";
  import MessageComponent from "./Message.svelte";
  import RemoveFriendComponent from "../modals/RemoveFriend.svelte";
  import BlockFriendComponent from "../modals/BlockFriend.svelte";
import { FormFieldComponent } from "ui";

  let text = "";
  let messagesElement: HTMLElement;

  const onRemoveFriend = (): void => {
    const {name} = $accountStore.social.chat;
    modalService.open(RemoveFriendComponent, {name});
  };

  const onBlockFriend = (): void => {
    const {name} = $accountStore.social.chat;
    modalService.open(BlockFriendComponent, {name});
  };

  const onChatClose = (): void => {
    $accountStore.social.chat.isOpen = false;
  };

  const onSendMessage = (): void => {
    if (text) {
      const receiver = $accountStore.social.chat.name;
      socketService.socket.emit("sendChatMsg", {receiver, text});
      text = "";
    }
  };

  afterUpdate((): void => {
    if ($accountStore.social.chat.isOpen) {
      messagesElement.scrollTo(0, messagesElement.scrollHeight);
    }
  });
</script>

<style>
  .chat {
    position: absolute;
    bottom: 0;
    right: 437px;
    height: 640px;
    width: 480px;
    display: flex;
    flex-direction: column;
    background-color: rgba(31, 31, 31, 0.1);
    border: 2px solid rgb(var(--grey));
    border-radius: 8px;
    /* background-color: rgb(var(--dark-grey)); */
    backdrop-filter: blur(32px);
    overflow: hidden;
    /* remove!! */
    z-index: 100;
  }

  .chat__header {
    background-color: rgb(var(--dark-grey));
    padding: var(--spacing-sm);
    display: flex;
    justify-content: space-between;
  }

  .chat__msgs {
    padding: var(--spacing-md);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    flex-grow: 1;
    overflow-y: scroll;
    overflow-x: hidden;
    /* Scrollbar for firefox */
    scrollbar-width: thin;
    scrollbar-color: rgb(var(--dark-grey)) transparent;
  }

  .chat__msgs::-webkit-scrollbar {
    width: 8px;
  }

  .chat__msgs::-webkit-scrollbar-track {
    background-color: transparent;
  }

  .chat__msgs::-webkit-scrollbar-thumb {
    background-color: rgb(var(--dark-grey));
    border: 1px solid transparent;
    border-radius: 8px;
    box-sizing: border-box;
  }

  .chat__form {
    width: 100%;
    flex-shrink: 1;
padding: var(--spacing-md);
    box-sizing: border-box;
  }

  .chat__form input {
    width: 100%;
  }

  .chat__header__main {
    display: flex;
  }
</style>

{#if $accountStore.social.chat.isOpen}
  <div class="chat" in:slide out:fade>
    <div class="chat__header">
      <div class="chat__header__main">
        <button class="button-icon" on:click={onRemoveFriend}>
          <i class="fa-solid fa-user-xmark"></i>
        </button>
        <button class="button-icon" on:click={onBlockFriend}>
          <i class="fa-sharp fa-solid fa-ban"></i>
        </button>
      </div>
      <button class="button-icon" on:click={onChatClose}>
        <i class="fa-solid fa-times"></i>
      </button>
    </div>

    <div class="chat__msgs" bind:this={messagesElement}>
      {#each $accountStore.social.chat.messages as message}
        <MessageComponent {message}/>
      {/each}
    </div>

    <form class="chat__form" on:submit|preventDefault={onSendMessage}>
      <FormFieldComponent label="Message" bind:value={text}/>
    </form>
  </div>
{/if}
