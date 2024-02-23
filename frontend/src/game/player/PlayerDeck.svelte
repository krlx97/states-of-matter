<script lang="ts">
  import { modalService } from "services";
  import {gameStore} from "stores";
  import Surrender from "../modals/Surrender.svelte";

  const onSurrender = (): void => {
    modalService.open(Surrender);
  };
</script>

<style>
  .deck {
    height: var(--card-height);
    width: var(--card-width);
    position: relative;
    border: 1px solid rgba(var(--primary), 0.4);
    box-sizing: border-box;
    border-radius: 8px;
    /* overflow: hidden; */
  }

  .deck__cards {
    position: absolute;
    top: -48px;
    left: 50%;
    width: 75%;
    padding: var(--sm);
    background-color: rgb(31, 31, 31);
    border-radius: 8px;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
  }
</style>

<div class="deck" on:click="{onSurrender}">
  <img src="images/card/card-back.png" alt="Deck" height="214" width="142"/>
  <div class="deck__cards">{$gameStore.player.deck} / 30</div>
</div>
