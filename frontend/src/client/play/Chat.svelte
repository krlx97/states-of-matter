<script lang="ts">
  import {afterUpdate} from "svelte";
  import {quadInOut} from "svelte/easing";
  import {fade, fly, slide, type FlyParams} from "svelte/transition";
  import {PlayerStatus} from "@som/shared/enums";
  import {socketService, soundService} from "services";
  import {chatStore, lobbyStore} from "stores";
  import {ButtonComponent, InputComponent} from "ui";
  import MessageComponent from "./Message.svelte";

  let text = "";
  let messagesElement: HTMLElement;

  const flyAnimation: FlyParams = {
    duration: 400,
    easing: quadInOut,
    y: 900,
    opacity: 1
  };

  const onChatClose = (): void => {
    $chatStore.isOpen = false;
    soundService.play("click");
  };

  const onSendMessage = (): void => {
    if (text) {
      const receiver = $chatStore.name;
      socketService.socket.emit("sendChatMessage", {receiver, text});
      text = "";
    }
  };

  afterUpdate((): void => {
    if ($chatStore.isOpen) {
      messagesElement.scrollTo(0, messagesElement.scrollHeight);
    }
  });
</script>

<style>
  .chat {
    /* position: absolute;
    bottom: 0;
    right: 428px; */
    height: calc(900px - 64px);
    width: 50%;
    display: flex;
    flex-direction: column;
    background-color: rgba(var(--dark-grey));
    border: 0 solid;
    border-right-width: 1px;
    border-image: linear-gradient(
      180deg,
      rgb(var(--dark-grey)) 0%,
      rgba(var(--grey), 0.3333) 50%,
      rgb(var(--dark-grey)) 100%
    ) 1;
    /* border: 1px solid rgb(var(--grey));
    border-radius: 8px; */
    /* z-index: 20; */
    box-sizing: border-box;
  }

  .chat__header {
    padding: var(--xs);
    display: flex;
    justify-content: space-between;
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }

  .chat__msgs {
    padding: var(--md);
    display: flex;
    flex-direction: column;
    gap: var(--md);
    flex-grow: 1;
    overflow-y: scroll;
    /* scrollbar-width: thin;
    scrollbar-color: rgb(var(--dark-grey)) transparent; */
    box-sizing: border-box;
  }

  .chat__msgs::-webkit-scrollbar {
    width: 4px;
  }

  .chat__msgs::-webkit-scrollbar-track {
    border-radius: 8px;
  }

  .chat__msgs::-webkit-scrollbar-thumb {
    background-color: rgb(var(--grey));
    border-radius: 8px;
  }

  .chat__form {
    width: 100%;
    padding: var(--xs);
    box-sizing: border-box;
    /* border: 0 solid;
    border-top-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1; */
  }
</style>

<!-- {#if $chatStore.isOpen} -->
  <div class="chat">
    <!-- <div class="chat__header">
      {$chatStore.name}
      <ButtonComponent isIcon on:click="{onChatClose}">×</ButtonComponent>
    </div> -->

    <div class="chat__msgs" bind:this="{messagesElement}">
      {#each $lobbyStore.messages as message}
        <MessageComponent {message}/>
      {/each}
    </div>

    <form class="chat__form" on:submit|preventDefault="{onSendMessage}">
      <InputComponent label="Message" bind:value="{text}"/>
    </form>
  </div>
<!-- {/if} -->
