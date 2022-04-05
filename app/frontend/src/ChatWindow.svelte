<script lang="ts">
  import {beforeUpdate, afterUpdate, onMount} from "svelte";
  import {miscService, socketService} from "services";
  import {playerStore, socialStore, chatStore} from "stores";
  import FontAwesome from "./ui/FontAwesome.svelte";

  let text = "";
  let chatMessagesRef: HTMLElement;

  const onTip = (): void => {
    const {username} = $socialStore.chat;
    miscService.openModal("tip", {username});
  };

  const onGift = (): void => {
    const {username} = $socialStore.chat;
    miscService.openModal("gift", {username});
  };

  const onUnfriend = (): void => {
    const {username} = $socialStore.chat;
    miscService.openModal("unfriend", {username});
  };

  const onBlock = (): void => {
    const {username} = $socialStore.chat;
    miscService.openModal("block", {username});
  };

  const onChatClose = (): void => { $socialStore.chat.isOpen = false; };

  const onSendMessage = (): void => {
    if (text) {
      const sender = $playerStore.username;
      const receiver = $socialStore.chat.username;
      const date = new Date();

      socketService.socket.emit("sendChatMsg", {sender, receiver, text, date});
      text = "";
    }
  };

  onMount(() => {
    if ($socialStore.chat.isOpen) {
      chatMessagesRef.scrollTo(0, chatMessagesRef.scrollHeight);
    }
  });

  beforeUpdate(() => {
    const newChat: Array<any> = [];

    $socialStore.chat.messages.forEach((message) => {
      const date = new Date(message.date);
      const timeString = date.toLocaleTimeString(["en-US"], {
        hour: "2-digit",
        minute: "2-digit"
      });
      const newChatLast = newChat[newChat.length - 1];

      if (newChat.length && newChatLast.username === message.username) {
        newChatLast.messages.push({text: message.text, date: timeString});
      } else {
        newChat.push({
          username: message.username,
          messages: [{text: message.text, date: timeString}]
        });
      }
    });

    chatStore.set(newChat);
  });

  afterUpdate(() => {
    if ($socialStore.chat.isOpen) {
      chatMessagesRef.scrollTo(0, chatMessagesRef.scrollHeight);
    }
  });
</script>

<style lang="scss">
  .chat {
    position: absolute;
    bottom: 0;
    right: 392px;
    height: 640px;
    width: 480px;
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--light-grey));
    box-shadow: var(--elevation-lg);
    z-index: 2;
  }

  .chat__header {
    background-color: rgb(var(--dark-grey));
    padding: var(--spacing-sm);
    display: flex;
    justify-content: space-between;
  }

  .chat__msgs {
    flex-grow: 1;
    overflow-y: scroll;
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

  .chat__sender {
    padding: var(--spacing-sm);
    width: 100%;
    display: flex;
    border-bottom: 1px solid rgb(var(--light-grey));
    box-sizing: border-box;
  }
  .chat__sender__avatar {
    height: 48px;
    width: 48px;
    margin-right: var(--spacing-sm);
    border-radius: 50%;
  }
  .chat__sender__msgs {
    flex-grow: 1;
  }
  .chat__sender__username {
    margin-bottom: var(--spacing-sm);
  }
  .chat__sender__msg {
    display: flex;
    width: 100%;
  }
  .chat__sender__msg__date {
    flex-basis: 80px;
    font-size: var(--font-sm);
    font-family: monospace;
    margin-right: var(--spacing-sm);
    color: rgb(222, 222, 222);
  }
  .chat__sender__msg__text {
    flex-basis: 100%;
  }

  .chat__form {
    width: 100%;
    flex-shrink: 1;
  }
  .chat__form input {
    width: 100%;
  }
</style>

{#if $socialStore.chat.isOpen}
  <div class="chat">
    <header class="chat__header">
      <div>
        <button class="btn--icon" on:click={onTip}>
          <FontAwesome icon="donate"/>
        </button>
        <button class="btn--icon" on:click={onGift}>
          <FontAwesome icon="gift"/>
        </button>
        <button class="btn--icon" on:click={onUnfriend}>
          <FontAwesome icon="user-times"/>
        </button>
        <button class="btn--icon" on:click={onBlock}>
          <FontAwesome icon="ban"/>
        </button>
      </div>
      <button class="btn--icon-primary" on:click={onChatClose}>
        <FontAwesome icon="times"/>
      </button>
    </header>

    <main class="chat__msgs" bind:this={chatMessagesRef}>
      {#each $chatStore as message}
        <div class="chat__sender">

          <img
            class="chat__sender__avatar"
            src="assets/avatars/{
              message.username === $playerStore.username ?
              $playerStore.avatarId :
              $socialStore.chat.avatarId
            }.jpg"
            alt="Player avatar">

          <div class="chat__sender__msgs">
            <h4 class="chat__sender__username">
              {
                message.username === $playerStore.username ?
                $playerStore.username :
                $socialStore.chat.username
              }
            </h4>
            {#each message.messages as msg}
              <div class="chat__sender__msg">
                <p class="chat__sender__msg__date">
                  {msg.date}
                </p>
                <p class="chat__sender__msg__text">
                  {msg.text}
                </p>
              </div>
            {/each}
          </div>

        </div>
      {/each}
    </main>

    <form class="chat__form" on:submit|preventDefault={onSendMessage}>
      <input placeholder="Message" bind:value={text}>
    </form>
  </div>
{/if}
