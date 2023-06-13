<script lang="ts">
  import {fly, type FlyParams} from "svelte/transition";
  import {quadInOut} from "svelte/easing";
  import {playerStore} from "stores";
  import type {Message} from "@som/shared/types/frontend";

  let message: Message;

  $: isSender = message.name === $playerStore.name;
  $: isReceiver = message.name !== $playerStore.name;

  const flyParams: FlyParams = {
    duration: 250,
    easing: quadInOut,
    x: isSender ? 64 : -64
  };

  export {message};
</script>

<style>
  .message {
    width: 100%;
    box-sizing: border-box;
  }

  .isSender {
    text-align: right;
    border-right: 1px solid rgb(var(--blue));
    padding-right: var(--spacing-sm);
  }

  .isReceiver {
    text-align: left;
    border-left: 1px solid rgb(var(--green));
    padding-left: var(--spacing-sm);
  }

  .message__date {
    margin-bottom: var(--spacing-md);
    font-family: monospace;
    font-size: var(--font-sm);
    color: rgb(127, 127, 127);
  }

  .message__text {
    line-height: 1.4;
  }
</style>

<div class="message" class:isSender class:isReceiver in:fly={{
    duration: 250,
    easing: quadInOut,
    x: isSender ? 64 : -64
  }}>
  <div class="message__date">
    {new Date(message.date).toLocaleDateString()} | {new Date(message.date).toLocaleTimeString()}
  </div>
  <div class="message__text">
    {message.text}
  </div>
</div>
