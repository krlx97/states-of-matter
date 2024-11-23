<script lang="ts">
  import {fly, type FlyParams} from "svelte/transition";
  import {quadInOut} from "svelte/easing";
  import {playerStore} from "stores";
  import type {ChatMessage} from "@som/shared/types/mongo";

  let message: ChatMessage;
  const isSender = message.name === $playerStore.name;
  const isReceiver = message.name !== $playerStore.name;

  const flyParams: FlyParams = {
    duration: 400,
    easing: quadInOut,
    x: isSender ? 16 : -16
  };

  export {message};
</script>

<style>
  .message {
    width: 80%;
    line-height: 1.25;
  }

  .isSender {
    text-align: right;
    align-self: flex-end;
    border-right: 1px solid rgb(var(--primary));
    padding-right: var(--xs);
  }

  .isReceiver {
    text-align: left;
    align-self: flex-start;
    border-left: 1px solid rgb(var(--success));
    padding-left: var(--xs);
  }

  .message__date {
    display: flex;
    gap: var(--xs);
    font-family: monospace;
    font-size: var(--xs);
    color: rgb(var(--grey));
  }

  .message__text {
    width: 100%;
    text-align: justify;
  }

  .right {
    text-align-last: right;
  }

  .left {
    text-align-last: left;
  }
</style>

<div class="message" class:isSender class:isReceiver in:fly="{flyParams}">
  <div
    class="message__date"
    style:flex-direction="{isSender ? "row-reverse" : "row"}"
    style:justify-content="{isSender ? "flex-start" : "flex-start"}">
    <div style:color="{isSender ? "rgb(var(--primary))" : "rgb(var(--success))"}">{message.name}</div>
    <div>{new Date(message.date).toLocaleDateString()}</div>
    <div>{new Date(message.date).toLocaleTimeString()}</div>
  </div>
  <div class="message__text" class:right="{isSender}" class:left="{isReceiver}">
    {message.text}
  </div>
</div>
