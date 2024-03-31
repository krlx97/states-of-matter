<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService, soundService} from "services";
  import {ProgressBarComponent, TextComponent} from "ui";
  import type {PlayerDeckView} from "@som/shared/types/views";
  import { playerStore } from "stores";

  const dispatch = createEventDispatcher();
  let deck: PlayerDeckView;

  const selectDeck = (): void => {
    if ($playerStore.deckId !== deck.id) {
      socketService.socket.emit("selectDeck", {
        deckId: deck.id
      });
    }

    dispatch("toggleDeckSlots");
    soundService.play("click");
  };

  const selectedIcon = new Map([
    [1, 10500],
    [2, 11000],
    [3, 11500],
    [4, 12000],
  ]);

  const klassColors = new Map([
    [0, "neutral"],
    [1, "solid"],
    [2, "liquid"],
    [3, "gas"],
    [4, "plasma"]
  ]);

  $: bars = [{
    color: "white",
    progress: deck.attribute.neutral / 30 * 100,
    val: deck.attribute.neutral
  }, {
    color: "red",
    progress: deck.attribute.solid / 30 * 100,
    val: deck.attribute.solid
  }, {
    color: "blue",
    progress: deck.attribute.liquid / 30 * 100,
    val: deck.attribute.liquid
  }, {
    color: "green",
    progress: deck.attribute.gas / 30 * 100,
    val: deck.attribute.gas
  }, {
    color: "plasma",
    progress: deck.attribute.plasma / 30 * 100,
    val: deck.attribute.plasma
  }];

  export {deck};
</script>

<style>
  .selected-deck {
    padding: var(--xs);
    display: flex;
    align-items: center;
    gap: var(--xs);
    border: 1px solid rgba(var(--grey), 0.333);
    font-size: var(--xs);
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 400ms, background-color 400ms;
  }

  .selected-deck:hover {
    border-color: rgb(var(--white));
    cursor: pointer;
    background-color: rgb(var(--dark-grey));
  }

  .selected-deck__attrs {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .deck__stats {
    display: flex;
    gap: var(--xs);
  }

  .deck__stat {
    display: flex;
    align-items: center;
  }

  .imgg {border-radius: 50%}

  .selected-deck__imgg {
    position: relative;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="selected-deck" on:click="{selectDeck}">

  <div class="selected-deck__imgg">
    <img class="imgg" src="images/items/sm/{selectedIcon.get(deck.klass)}.png" alt="Hero" height="48" width="48"/>
  </div>

  <div class="selected-deck__attrs">

    <div style="display: flex; justify-content: space-between; line-height: 1.25;;">
      <div class="selected-deck__main__title" style="font-size: var(--xs);">
        <TextComponent color="{klassColors.get(deck.klass) || "common"}" size="xs">
          {deck.name}
        </TextComponent>
        <br/>
        {deck.cardsInDeck} / 30
      </div>

      <div class="selected-deck__main__title">
        <div class="deck__stats">
          <TextComponent color="damage" size="xs">
            {deck.average.damage.toFixed(2)}
          </TextComponent>
          <TextComponent color="mana" size="xs">
            {deck.average.manaCost.toFixed(2)}
          </TextComponent>
          <TextComponent color="health" size="xs">
            {deck.average.health.toFixed(2)}
          </TextComponent>
        </div>

        <div class="deck__stats">
          <div class="deck__stat">
            <img src="images/card/minion.png" height="16" width="16" alt="Minion"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.minion}</div>
            </div>
          </div>
          <div class="deck__stat">
            <img src="images/card/magic.png" height="16" width="16" alt="Magic"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.magic}</div>
            </div>
          </div>
          <div class="deck__stat">
            <img src="images/card/trap.png" height="16" width="16" alt="Trap"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.trap}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ProgressBarComponent {bars}/>
  </div>

</div>
