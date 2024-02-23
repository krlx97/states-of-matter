<script lang="ts">
  import {onMount} from "svelte";
  import {cardEffectNames, cardsView, items} from "@som/shared/data";
  import {CardType, CardKlass} from "@som/shared/enums";
  import {gameStore} from "stores";
  import {TextComponent} from "ui";
  import type {EasingFunction, TransitionConfig} from "svelte/transition";
  import type {GameCard} from "@som/shared/types/mongo";

  let card: GameCard;
  let isOpponent = false;
  let cardView = {
    id: 0,
    name: "",
    lore: "",
    effect: {name: "", description: ""},
    ability: {name: "", description: ""}
  };
  let selectedSkin = {cardId: 0, skinId: 0};
  let klassTooltip: any;
  let isToggled = false;
  let isSelected = false;
  let isAttackable = false;
  let isTargetable = false;
  let item = items[0];

  const onToggleKlassTooltip = (): void => {
    isToggled = !isToggled;
    klassTooltip.style.zIndex = isToggled ? "10" : "-1";
    klassTooltip.style.opacity = isToggled ? "1" : "0";
  };

  export {card, isOpponent, isSelected, isAttackable, isTargetable};

  interface Spin {
    delay: number | undefined;
    duration: number | undefined;
    easing: EasingFunction | undefined;
  }

  const spin = (
    node: Element,
    {delay, duration, easing}: Spin
  ): TransitionConfig => ({
    delay,
    duration,
    easing,
    css: (t) => `transform: translateX(-50%) scale(${(t + 0.2) / t});`
  });


  onMount((): void => {
    if (isOpponent) {
      selectedSkin = $gameStore.opponent.skins?.find((skin): boolean => skin.cardId === card.id) || {cardId: 0, skinId: 0};
    } else {
      selectedSkin = $gameStore.player.skins?.find((skin): boolean => skin.cardId === card.id) || {cardId: 0, skinId: 0};
    }

    

    cardView = cardsView.find(({id}): boolean => card.id === id);
    item = items.find(({id}): boolean => selectedSkin.skinId === id) || items[0];
  });
</script>

<style>
  .card {
    position: relative;
    height: var(--card-height);
    width: var(--card-width);
    display: flex;
    border: 1px solid rgba(var(--grey), var(--opacity-sm));
    border-radius: 8px;
    /* box-sizing: border-box; */
    overflow: hidden;
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

  .card__type__tooltip {
    position: absolute;
    top: 100%;
    left: 0;
    /* height: 135px;
    width: 108px; */
    padding: var(--xsm);
    display: none;
    background-color: rgba(32, 32, 32, 0.95);
    box-sizing: border-box;
    font-size: 0.8rem;
  }

 .card__type:hover .card__type__tooltip {
    display: initial;
  }

  .card__klass {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 11;
  }

  .card__klass__tooltip {
    position: absolute;
    top: 0;
    left: 0;
    height: var(--card-height);
    width: var(--card-width);
    padding: var(--xs);
    opacity: 0;
    backdrop-filter: blur(8px);
    background-color: rgba(var(--dark-grey), 0.9);
    box-sizing: border-box;
    border-radius: 8px;
    z-index: -1;
    /* line-height: 1.25; */
    font-size: var(--sm);
    transition: opacity 400ms cubic-bezier(var(--ease-in-out-quad));
  }

  .tooltip__name {
    margin-bottom: var(--xs);
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
    font-size: 0.8rem;
    text-align: center;
    z-index: 2;
  }

  .card__mana {
    position: absolute;
    bottom: 6px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
  }

  .card__mana--center {
    bottom: 8px;
    right: unset;
    left: 50%;
    transform: translateX(-50%);
  }

  .card__health {
    position: absolute;
    bottom: 6px;
    right: 6px;
    z-index: 2;
  }

  .card__health__num {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    font-size: 14px;
  }

  .card__damage {
    position: absolute;
    bottom: 6px;
    left: 6px;
    /* transform: translateX(-50%); */
    z-index: 2;
  }

  .card__ability {
    position: absolute;
    bottom: 6px;
    left: 6px;
    /* transform: translateX(-50%); */
    z-index: 2;
  }

  .card__ability:hover .card__ability__tooltip {
    display: initial;
  }

  .card__ability__tooltip {
    position: absolute;
    bottom: calc(100% + 8px);
    left: 50%;
    height: 136px;
    width: 108px;
    padding: var(--xs);
    display: none;
    background-color: rgba(32, 32, 32, 0.95);
    box-sizing: border-box;
    font-size: 0.8rem;
    transform: translateX(-50%);
    z-index: 0;
  }

  .card__avatar {
    position: absolute;
    top: 30px;
    left: 18px;
  }

  .card__front {
    z-index: 1;
  }

  .isSelected {
    animation: isSelectedBorder 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  .isSelected::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 8px 4px rgb(var(--white));
    animation: glow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes glow {
    from {opacity: 0;}
    to {opacity: 1;}
  }

 .isAttackable, .isTargetable {
    animation: isAttackableBorder 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

 .isAttackable::after, .isTargetable::after {
    content: "";
    position: absolute;
    border-radius: 8px;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    box-shadow: 0 0 8px 4px rgb(var(--damage));
    animation: glow 1s cubic-bezier(var(--ease-in-out-quad)) infinite alternate;
  }

  @keyframes isSelectedBorder {
    from {border-color: rgb(127, 127, 127);}
    to {border-color: rgb(255, 255, 255);}
  }

  @keyframes isAttackableBorder {
    from {border-color: rgb(127, 127, 127);}
    to {border-color: rgb(var(--damage));}
  }

  .buffs {
    position: absolute;
    bottom: calc(100% + 16px);
    left: 50%;
    transform: translateX(-50%);
    width: 144px;
    text-align: center;
    display: flex;
    flex-direction: column;
    background-color: rgb(47, 47, 47);
    border-radius: 8px;
    line-height: 1.25;
  }

  /* .buff {color: rgb(var(--green));}
  .debuff {color: rgb(var(--red));} */
  .canAttack {
    position: absolute;
    bottom: calc(100%);
    left: -5%;
    animation: pop 1s linear infinite alternate;
  }

  @keyframes pop {
    from {transform: scale(1)}
    to {transform: scale(1.5);}
  }
</style>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="card" class:isSelected class:isAttackable class:isTargetable on:click>
  {#if card.type === CardType.MINION && !card.canAttack}
    <div class="canAttack">💤</div>
  {/if}

  {#if card.type === CardType.MINION || card.type === CardType.HERO}
    <div class="buffs">
      {#each card.buffs as buff}
        <TextComponent color="success">
          {cardEffectNames.get(buff.id)}
          {#if buff.data}
            ({Object.values(buff.data)})
          {/if}
        </TextComponent>
      {/each}
      {#each card.debuffs as debuff}
        <TextComponent color="warn">{cardEffectNames.get(debuff.id)}</TextComponent>
      {/each}
    </div>
  {/if}

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
    <div class="card__type__tooltip">
      {#if card.type === CardType.HERO}
        Hero
      {:else if card.type === CardType.MINION}
        Minion
      {:else if card.type === CardType.MAGIC}
        Magic
      {:else}
        Trap
      {/if}
    </div>
  </div>

  <div class="card__klass" on:click|stopPropagation={onToggleKlassTooltip}>
    {#if card.klass === CardKlass.SOLID}
      <img src="images/card/{CardKlass.SOLID}.png" alt="Solid"/>
    {:else if card.klass === CardKlass.LIQUID}
      <img src="images/card/{CardKlass.LIQUID}.png" alt="Liquid"/>
    {:else if card.klass === CardKlass.GAS}
      <img src="images/card/{CardKlass.GAS}.png" alt="Gas"/>
    {:else if card.klass === CardKlass.PLASMA}
      <img src="images/card/{CardKlass.PLASMA}.png" alt="Plasma"/>
    {:else}
      <img src="images/card/{CardKlass.NEUTRAL}.png" alt="Neutral"/>
    {/if}
  </div>

  <div class="card__klass__tooltip" bind:this={klassTooltip}>
    {#if cardView}
      <div class="tooltip__name">{cardView.effect.name}</div>
      <div class="tooltip__text">
        {#each cardView.effect.description as chunk}
          {#if typeof chunk === "string"}
            {chunk}
          {:else}
            <TextComponent color="{chunk[0]}">{chunk[1]}</TextComponent>
          {/if}
        {/each}
      </div>
    {/if}
  </div>

  <div class="card__name">{cardView ? cardView.name : "nema"}</div>
  <img class="card__front" src="images/card/card-front.png" alt="Card Border"/>

  {#if item.rarity === 0 || item.rarity === 3}
    <img class="card__avatar" src="images/items/{selectedSkin.skinId}.png" height=136 width=108 alt="Card skin"/>
  {:else}
    <video class="card__avatar" autoplay loop muted>
      <source src="images/items/{selectedSkin.skinId}.webm" type="video/webm"/> {selectedSkin.skinId}
    </video>
  {/if}

  {#if card.type === CardType.HERO}
    <div class="card__ability">
      {#if card.ability === 0}
        <img src="images/card/fortify.png" alt="Ability"/>
      {:else if card.ability === 1}
        <img src="images/card/heal.png" alt="Ability"/>
      {:else if card.ability === 2}
        <img src="images/card/neurotoxin.png" alt="Ability"/>
      {:else}
        <img src="images/card/corruption.png" alt="Ability"/>
      {/if}

      <div class="card__ability__tooltip">
        {#if cardView}
          {cardView.ability?.name}
          <hr/>
          {cardView.ability?.description}
        {/if}
      </div>
    </div>
    <div class="card__mana card__mana--center">
      <img src="images/card/mana.png" alt="Mana"/>
      {#key card.mana.current}
        <div class="card__health__num" in:spin={{duration: 600}}>{card.mana.current}</div>
      {/key}
    </div>
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
        {#key card.health.current}
          <div class="card__health__num" in:spin={{duration: 600}}>{card.health.current}</div>
        {/key}
    </div>
  {:else if card.type === CardType.MINION}
    <div class="card__health">
      <img src="images/card/health.png" alt="Health"/>
      {#key card.health.current}
        <div class="card__health__num" in:spin={{duration: 600}}>{card.health.current}</div>
      {/key}
    </div>
    <div class="card__damage">
      <img src="images/card/damage.png" alt="Damage"/>
      {#key card.damage.current}
        <div class="card__health__num" in:spin={{duration: 600}}>{card.damage.current}</div>
      {/key}
    </div>
    <div class="card__mana">
      <img src="images/card/manacost.png" alt="Mana cost"/>
      {#key card.manaCost.current}
        <div class="card__health__num" in:spin={{duration: 600}}>{card.manaCost.current}</div>
      {/key}
    </div>
  {:else}
    <div class="card__mana card__mana--center">
      <img src="images/card/manacost.png" alt="Mana cost"/>
      {#key card.manaCost.current}
        <div class="card__health__num" in:spin={{duration: 600}}>{card.manaCost.current}</div>
      {/key}
    </div>
  {/if}
</div>
