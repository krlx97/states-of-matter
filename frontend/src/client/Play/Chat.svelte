<script lang="ts">
  import {afterUpdate} from "svelte";
  import {socketService} from "services";
  import {lobbyStore} from "stores";
  import {InputComponent} from "ui";
  import MessageComponent from "./Message.svelte";

  let text = "";
  let messagesElement: HTMLElement;


  const onSendMessage = (): void => {
    if (text) {
      const receiver = "";
      socketService.socket.emit("sendChatMessage", {receiver, text});
      text = "";
    }
  };

  afterUpdate((): void => {
    messagesElement.scrollTo(0, messagesElement.scrollHeight);
  });
</script>

<style>
  .chat {
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
    box-sizing: border-box;
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
  }
</style>

<div class="chat">
  <div class="chat__msgs" bind:this="{messagesElement}">
    {#each $lobbyStore.messages as message}
      <MessageComponent {message}/>
    {/each}
  </div>

  <form class="chat__form" on:submit|preventDefault="{onSendMessage}">
    <InputComponent label="Message" bind:value="{text}"/>
  </form>
</div>
