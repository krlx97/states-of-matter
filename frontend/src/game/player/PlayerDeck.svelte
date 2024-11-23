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
    position: relative;
  }

  .deck__cards {
    position: absolute;
    top: -36px;
    left: 50%;
    width: 75%;
    padding: 4px var(--xs);
    background-color: rgb(var(--dark-grey));
    border-radius: 8px;
    box-sizing: border-box;
    text-align: center;
    transform: translateX(-50%);
    font-size: var(--xs);
  }
</style>

<div class="deck" on:click="{onSurrender}">
  <img src="images/card/card-back.png" alt="Deck"/>
  <div class="deck__cards">
    Deck<br/>
    {$gameStore.player.deck} / 30
  </div>
</div>
