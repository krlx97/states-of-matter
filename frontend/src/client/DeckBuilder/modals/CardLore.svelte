<script lang="ts">
  import {onMount} from "svelte";
  import {cardsView, items} from "@som/shared/data";
  import {modalStore, playerStore} from "stores";
  import {ClientCardComponent, ModalComponent} from "ui";
  import CardSkinComponent from "./CardSkin.svelte";

  const {id} = $modalStore.data;

  let cardView = cardsView.find((card): boolean => card.id === id);
  $: skins = items.filter((item): boolean => item.type === 2 && item.cardId === id);

  onMount((): void => {
    cardView = cardsView.find((card): boolean => card.id === id);
    skins = items.filter((item): boolean => item.type === 2 && item.cardId === id);
  });
</script>

<style>
  .lore {
    display: flex;
    width: 606px;
  }

  .lore__info {
    position: relative;
    margin-left: 1em;
    flex-grow: 1;
    font-style: italic;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .lore__info__text {
    text-align: justify;
    text-justify: inter-word;
    line-height: 1.25;
  }

  .skins {
    display: flex;
    align-self: flex-end;
    gap: var(--xs);
  }
</style>

<ModalComponent width="606px">
  <div class="lore">

    <div class="lore__card">
      {#key $playerStore}
        <ClientCardComponent card={$modalStore.data}/>
      {/key}
    </div>

    <div class="lore__info">
      <div class="lore__info__text">{cardView.lore}</div>

      <div class="skins">
        {#key $playerStore}
          {#each skins as skin}
            <CardSkinComponent {skin}/>
          {/each}
        {/key}
      </div>
    </div>
  </div>
</ModalComponent>
