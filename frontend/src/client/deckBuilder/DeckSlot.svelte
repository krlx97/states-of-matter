<script lang="ts">
  import {createEventDispatcher} from "svelte";
  import {socketService, soundService} from "services";
  import {LinkComponent, ProgressBarComponent, TextComponent} from "ui";
  import type {PlayerDeckView} from "@som/shared/types/views";

  const dispatch = createEventDispatcher();
  let deck: PlayerDeckView;
  const progress = deck.cardsInDeck / 30 * 100;

  const selectDeck = (): void => {
    socketService.socket.emit("selectDeck", {
      deckId: deck.id
    });

    dispatch("toggleDeckSlots");
    soundService.play("click");
  };

  const selectedIcon = new Map([
    [1, 105000],
    [2, 110000],
    [3, 115000],
    [4, 120000],
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
  .deck-slot {
    padding: var(--md);
    display: flex;
    align-items: center;
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 100%
    );
    /* border: 1px solid;
    border-right-width: 0;
    border-left-width: 0;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1; */
    box-sizing: border-box;
    cursor: pointer;
  }

  .deck-slot:hover {
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.4) 0%,
      rgba(0, 0, 0, 0) 100%
    );
  }

  .deck-slot__img {
    margin-right: var(--md);
    display: flex;
    align-items: center;
  }

  .deck-slot__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .deck-slot__info__title {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }



.selected-deck {
    padding: var(--xs);
    display: flex;
    align-items: center;
    gap: var(--xs);
    border: 1px solid rgba(var(--grey), 0.333);
    /* border: 0 solid; */
    /* border-bottom-color: rgb(var(--grey)); */
    /* border-image: linear-gradient(
      90deg,
      rgb(63, 63, 63) 0%,
      rgb(var(--grey)) 50%,
      rgb(63, 63, 63) 100%
    ) 1; */
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

  .selected-deck__main {
    font-size: var(--sm);
    display: flex;
    align-items: center;
    gap: var(--sm);
  }

  .selected-deck__img {
    margin-right: var(--md);
    display: flex;
    align-items: center;
  }

  .selected-deck__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
  }

  .selected-deck__main__title {
    /* flex-grow: 1; */
    /* width: 100%; */
    /* display: flex;
    justify-content: space-between; */
  }

  .selected-deck__info__actions {
    display: flex;
    justify-content: center;
    gap: var(--sm);
  }

  .deck__stats {
    /* margin-top: var(--md); */
    display: flex;
    gap: var(--xs);
    /* align-items: center;
    justify-content: space-evenly; */
    /* font-size: var(--font-xs); */
  }

  .deck__stat {
    display: flex;
    /* flex-direction: column; */
    align-items: center;
  }

  .imgg {border-radius: 50%}

  .selected-deck__imgg {
    position: relative;
  }

  .abs {
    position: absolute;
    bottom: 0;
    left: 0;
  }
</style>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- <div class="deck-slot" on:click="{selectDeck}">
  <div class="deck-slot__img">
    <img class="imgg" src="images/items/sm/{selectedIcon.get(deck.klass)}.png" alt="Hero" height="48" width="48"/>
  </div>
  <div class="deck-slot__info">
    <div class="deck-slot__info__title">
      <div>{deck.name}</div>
      <div>{deck.cardsInDeck} / 30</div>
    </div>
    <ProgressBarComponent bars="{[{
      color: "purple",
      progress
    }]}"/>
  </div>
</div> -->

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
            <img src="images/card/minion.png" height="16" width="16"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.minion}</div>
            </div>
          </div>
          <div class="deck__stat">
            <img src="images/card/magic.png" height="16" width="16"/>
            <div style="display: flex; flex-direction: column;">
              <div>{deck.attribute.magic}</div>
            </div>
          </div>
          <div class="deck__stat">
            <img src="images/card/trap.png" height="16" width="16"/>
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
