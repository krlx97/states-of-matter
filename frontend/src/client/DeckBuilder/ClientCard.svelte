<script lang="ts">
  import {onMount} from "svelte";
  import {items} from "@som/shared/data";
  import {CardType, CardKlass} from "@som/shared/enums";
  import {playerStore} from "stores";
  import {BreakComponent, TextComponent, TooltipComponent} from "ui";
  import type {ClientCard} from "@som/shared/types/game";

  let card: ClientCard;
  let isGlowing = false;
  let isGrayscale = false;
  let item = items[0];
  let selectedSkin = {cardId: 0, skinId: 0};
  let tooltipElement: HTMLDivElement;
  let tooltipComponent: TooltipComponent;

  const redBorder = isGlowing && card.klass === CardKlass.SOLID;
  const blueBorder = isGlowing && card.klass === CardKlass.LIQUID;
  const greenBorder = isGlowing && card.klass === CardKlass.GAS;
  const purpleBorder = isGlowing && card.klass === CardKlass.PLASMA;

  const onMousemove = (event: MouseEvent): void => {
    tooltipComponent.onMousemove(event);
    // const {clientX, clientY} = event;
    // const {offsetHeight, offsetWidth} = tooltipElement;
    // const x = clientX - offsetWidth / 2;
    // let y = clientY - offsetHeight - 64;

    // if (y < 0) {
    //   y = clientY + 64;
    // }

    // tooltipElement.style.opacity = "1";
    // tooltipElement.style.top = `${y}px`;
    // tooltipElement.style.left = `${x}px`;
  };

  const onMouseout = (): void => {
    tooltipComponent.onMouseout();
    // tooltipElement.style.opacity = "0";
  };

  onMount((): void => {
    // console.log($playerStore.skins);
    selectedSkin = $playerStore.skins.find(({cardId}): boolean => card.id === cardId) || {cardId: 0, skinId: 0};
    item = items.find(({id}): boolean => selectedSkin.skinId === id) || items[0];
  });

  export {card, isGlowing, isGrayscale};
</script>

<style>
  .card {
    position: relative;
    display: flex;
    height: var(--card-height);
    width: var(--card-width);
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    overflow: hidden;
    box-sizing: border-box;
  }

  .isGrayscale {
    filter: grayscale(1);
  }

  .card:hover {
    cursor: pointer;
  }

  .card__type {
    position: absolute;
    top: 3px;
    left: 3px;
    z-index: 2;
  }

  .card__klass {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 2;
  }

  .hr {
    margin: var(--xs) 0;
    /* padding-bottom: var(--xs); */
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgb(var(--dark-grey), 1) 0%,
      rgb(var(--grey), 1) 50%,
      rgb(var(--dark-grey), 1) 100%
    ) 1;
  }

  .tooltip__text {
    line-height: 1.25;
  }

  .card__name {
    position: absolute;
    top: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 84px;
    font-size: var(--xs);
    text-align: center;
    z-index: 2;
  }

  .card__mana {
    position: absolute;
    bottom: 3px;
    right: 3px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card__mana--center {
    bottom: 7px;
    right: unset;
    left: 50%;
    transform: translateX(-50%);
  }

  .card__health {
    position: absolute;
    bottom: 3px;
    left: 3px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card__health__num {
    width: var(--md);
    height: var(--md);
    font-size: var(--xs);
    border: 1px solid rgba(var(--health), var(--opacity-sm));
    background-color: rgb(var(--dark-grey));
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .card__damage__num {
    border-color: rgba(var(--damage), var(--opacity-sm));
  }
  .card__mana__num {
    border-color: rgba(var(--mana), var(--opacity-sm));
  }

  .card__damage {
    position: absolute;
    bottom: 7px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .card__ability {
    position: absolute;
    bottom: 7px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .card__avatar {
    position: absolute;
    top: 30px;
    left: 18px;
    height: 136px;
    width: 108px;
  }

  .card__front {
    z-index: 1;
  }

  .new__tooltip {
    position: fixed;
    width: 480px;
    padding: var(--sm);
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    border: 1px solid rgb(var(--grey));
    border-radius: 8px;
    opacity: 0;
    z-index: 10;
    transition: opacity 333ms cubic-bezier(var(--ease-in-out-quart));
  }
  .tooltiph {
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }
  .new__tooltip__title {
    /* margin-bottom: var(--md); */
    text-align: center;
  }
  .new__tooltip__attributes {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }
  .new__tooltip__attribute {
    display: flex;
    align-items: center;
    gap: var(--xs);
  }

  .redBorder {
    border-color: rgba(var(--solid), var(--opacity-sm));
  }
  .blueBorder {
    border-color: rgba(var(--liquid), var(--opacity-sm));
  }
  .greenBorder {
    border-color: rgba(var(--gas), var(--opacity-sm));
  }
  .purpleBorder {
    border-color: rgba(var(--plasma), var(--opacity-sm));
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<div
  class="card"
  class:redBorder
  class:blueBorder
  class:greenBorder
  class:purpleBorder
  on:mousemove="{onMousemove}"
  on:mouseout="{onMouseout}"
  on:click>

  <img class="card__front" src="images/card/card-front.png" alt="Card Border"/>

  <TooltipComponent bind:this={tooltipComponent}>
    <div class="tooltiph">
      <div class="new__tooltip__title"><TextComponent size="xl">{card.name}</TextComponent></div>
      <div style="text-align: justify; line-height: 1.25;">{card.lore}</div>

      <BreakComponent/>

      <div class="new__tooltip__attributes">

        {#if card.type === CardType.HERO}
          <div class="new__tooltip__attribute">
            <img src="images/card/hero.png" alt="Hero"/> Hero Card
          </div>
        {:else if card.type === CardType.MINION}
          <div class="new__tooltip__attribute">
            <img src="images/card/minion.png" alt="Minion"/> Minion Card
          </div>
        {:else if card.type === CardType.MAGIC}
          <div class="new__tooltip__attribute">
            <img src="images/card/magic.png" alt="Magic"/> Magic Card
          </div>
        {:else}
          <div class="new__tooltip__attribute">
            <img src="images/card/trap.png" alt="Trap"/> Trap Card
          </div>
        {/if}

        {#if card.klass === CardKlass.SOLID}
          <div class="new__tooltip__attribute">
            <img src="images/card/solid.png" alt="Solid"/> Solid Class
          </div>
        {:else if card.klass === CardKlass.LIQUID}
          <div class="new__tooltip__attribute">
            <img src="images/card/liquid.png" alt="Liquid"/> Liquid Class
          </div>
        {:else if card.klass === CardKlass.GAS}
          <div class="new__tooltip__attribute">
            <img src="images/card/gas.png" alt="Gas"/> Gas Class
          </div>
        {:else if card.klass === CardKlass.PLASMA}
          <div class="new__tooltip__attribute">
            <img src="images/card/plasma.png" alt="Plasma"/> Plasma Class
          </div>
        {:else}
          <div class="new__tooltip__attribute">
            <img src="images/card/neutral.png" alt="Neutral"/> Neutral Class
          </div>
        {/if}

      </div>

      <div class="new__tooltip__attributes">
        {#if card.type === CardType.MINION}
          <div class="new__tooltip__attribute">
            <img src="images/card/health.png" alt="Damage"/> {card.health} Health
          </div>
          <div class="new__tooltip__attribute">
            <img src="images/card/damage.png" alt="Damage"/> {card.damage} Damage
          </div>
          <div class="new__tooltip__attribute">
            <img src="images/card/mana-cost.png" alt="Damage"/> {card.manaCost} Mana Cost
          </div>
        {:else if card.type === CardType.HERO}
          <div class="new__tooltip__attribute">
            <img src="images/card/health.png" alt="Damage"/> {card.health} Health
          </div>
          <div class="new__tooltip__attribute">
            <img src="images/card/mana.png" alt="Damage"/> {card.mana} Mana
          </div>
        {:else if card.type === CardType.MAGIC || card.type === CardType.TRAP}
          <div class="new__tooltip__attribute">
            <img src="images/card/mana-cost.png" alt="Damage"/> {card.manaCost} Mana Cost
          </div>
        {/if}
      </div>

      <BreakComponent/>

      {#if card.type !== CardType.HERO}
        <div style="line-height: 1.25">
          <TextComponent color="primary">Effect</TextComponent>: {card.effect.name}

          <br/>

          <div class="tooltip__text">
            {#each card.effect.description as chunk}
              {#if typeof chunk === "string"}
                {chunk}
              {:else}
                <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
              {/if}
            {/each}
          </div>

        </div>
      {/if}
      {#if card.type === CardType.HERO}
        <br/>

        <TextComponent color="primary">Ability</TextComponent>: {card.ability.name}

        <br/>

        <div class="tooltip__text">
          {#each card.ability.description as chunk}
            {#if typeof chunk === "string"}
              {chunk}
            {:else}
              <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
            {/if}
          {/each}
        </div>
      {/if}
    </div>
  </TooltipComponent>
  <!-- <div class="new__tooltip" bind:this="{tooltipElement}">
    <div class="new__tooltip__title"><TextComponent size="xl">{card.name}</TextComponent></div>
    <div style="text-align: justify; line-height: 1.25;">{card.lore}</div>

    <div class="hr"></div>

    <div class="new__tooltip__attributes">

      {#if card.type === CardType.HERO}
        <div class="new__tooltip__attribute">
          <img src="images/card/hero.png" alt="Hero"/> Hero Card
        </div>
      {:else if card.type === CardType.MINION}
        <div class="new__tooltip__attribute">
          <img src="images/card/minion.png" alt="Minion"/> Minion Card
        </div>
      {:else if card.type === CardType.MAGIC}
        <div class="new__tooltip__attribute">
          <img src="images/card/magic.png" alt="Magic"/> Magic Card
        </div>
      {:else}
        <div class="new__tooltip__attribute">
          <img src="images/card/trap.png" alt="Trap"/> Trap Card
        </div>
      {/if}

      {#if card.klass === CardKlass.SOLID}
        <div class="new__tooltip__attribute">
          <img src="images/card/solid.png" alt="Solid"/> Solid Class
        </div>
      {:else if card.klass === CardKlass.LIQUID}
        <div class="new__tooltip__attribute">
          <img src="images/card/liquid.png" alt="Liquid"/> Liquid Class
        </div>
      {:else if card.klass === CardKlass.GAS}
        <div class="new__tooltip__attribute">
          <img src="images/card/gas.png" alt="Gas"/> Gas Class
        </div>
      {:else if card.klass === CardKlass.PLASMA}
        <div class="new__tooltip__attribute">
          <img src="images/card/plasma.png" alt="Plasma"/> Plasma Class
        </div>
      {:else}
        <div class="new__tooltip__attribute">
          <img src="images/card/neutral.png" alt="Neutral"/> Neutral Class
        </div>
      {/if}

    </div>

    <br/>

    <div class="new__tooltip__attributes">
      {#if card.type === CardType.MINION}
        <div class="new__tooltip__attribute">
          <img src="images/card/health.png" alt="Damage"/> {card.health} Health
        </div>
        <div class="new__tooltip__attribute">
          <img src="images/card/damage.png" alt="Damage"/> {card.damage} Damage
        </div>
        <div class="new__tooltip__attribute">
          <img src="images/card/mana-cost.png" alt="Damage"/> {card.manaCost} Mana Cost
        </div>
      {:else if card.type === CardType.HERO}
        <div class="new__tooltip__attribute">
          <img src="images/card/health.png" alt="Damage"/> {card.health} Health
        </div>
        <div class="new__tooltip__attribute">
          <img src="images/card/mana.png" alt="Damage"/> {card.mana} Mana
        </div>
      {:else if card.type === CardType.MAGIC || card.type === CardType.TRAP}
        <div class="new__tooltip__attribute">
          <img src="images/card/mana-cost.png" alt="Damage"/> {card.manaCost} Mana Cost
        </div>
      {/if}
    </div>

    <div class="hr"></div>

    {#if card.type !== CardType.HERO}
      <div style="line-height: 1.25">
        <TextComponent color="primary">Effect</TextComponent>: {card.effect.name}

        <br/>

        <div class="tooltip__text">
          {#each card.effect.description as chunk}
            {#if typeof chunk === "string"}
              {chunk}
            {:else}
              <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
            {/if}
          {/each}
        </div>

      </div>
    {/if}
    {#if card.type === CardType.HERO}
      <br/>

      <TextComponent color="primary">Ability</TextComponent>: {card.ability.name}

      <br/>

      <div class="tooltip__text">
        {#each card.ability.description as chunk}
          {#if typeof chunk === "string"}
            {chunk}
          {:else}
            <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
          {/if}
        {/each}
      </div>
    {/if}

  </div> -->

  <div class="card__type">
    {#if card.type === CardType.HERO}
      <img src="images/card/hero.png" alt="Hero"/>
    {:else if card.type === CardType.MINION}
      <img src="images/card/minion.png" alt="Minion"/>
    {:else if card.type === CardType.MAGIC}
      <img src="images/card/magic.png" alt="Magic"/>
    {:else}
      <img src="images/card/trap.png" alt="Trap"/>
    {/if}
  </div>

  <div class="card__name">{card.name}</div>

  <div class="card__klass">
    {#if card.klass === CardKlass.SOLID}
      <img src="images/card/solid.png" alt="Solid"/>
    {:else if card.klass === CardKlass.LIQUID}
      <img src="images/card/liquid.png" alt="Liquid"/>
    {:else if card.klass === CardKlass.GAS}
      <img src="images/card/gas.png" alt="Gas"/>
    {:else if card.klass === CardKlass.PLASMA}
      <img src="images/card/plasma.png" alt="Plasma"/>
    {:else}
      <img src="images/card/neutral.png" alt="Neutral"/>
    {/if}
  </div>

  {#if item.rarity === 0 || item.rarity === 2}
    <img
      class:isGrayscale
      class="card__avatar"
      src="images/items/{selectedSkin.skinId}.png"
      alt="Card skin"/>
  {:else}
    <video class:isGrayscale class="card__avatar" autoplay loop muted>
      <source src="images/items/{selectedSkin.skinId}.webm" type="video/webm"/>
      {selectedSkin.skinId}
    </video>
  {/if}

  {#if card.type === CardType.HERO}
    <div class="card__ability">
      {#if card.ability.id === 0}
        <img src="images/card/fortify.png" alt="Fortify"/>
      {:else if card.ability.id === 1}
        <img src="images/card/rejuvenate.png" alt="Rejuvenate"/>
      {:else if card.ability.id === 2}
        <img src="images/card/neurotoxin.png" alt="Neurotoxin"/>
      {:else}
        <img src="images/card/electrocute.png" alt="Electrocute"/>
      {/if}
    </div>
    <div class="card__mana">
      <img src="images/card/mana.png" alt="Mana"/>
      <div class="card__health__num card__mana__num">{card.mana}</div>
    </div>
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
      <div class="card__health__num card__health__num">{card.health}</div>
    </div>
  {:else if card.type === CardType.MINION}
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
      <div class="card__health__num card__health__num">{card.health}</div>
    </div>
    <div class="card__damage">
      <img src="images/card/damage.png" alt="Damage"/>
      <div class="card__health__num card__damage__num">{card.damage}</div>
    </div>
    <div class="card__mana">
      <img src="images/card/mana-cost.png" alt="Mana cost"/>
      <div class="card__health__num card__mana__num">{card.manaCost}</div>
    </div>
  {:else}
    <div class="card__mana card__mana--center">
      <img src="images/card/mana-cost.png" alt="Mana cost"/>
      <div class="card__health__num card__mana__num">{card.manaCost}</div>
    </div>
  {/if}
</div>
