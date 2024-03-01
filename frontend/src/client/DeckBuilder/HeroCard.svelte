<script lang="ts">
  import {modalService, soundService} from "services";
  import {deckCache, playerStore} from "stores";
  import {ClientCardComponent} from "ui";
  import {isDeckSame} from "./canSave";
  import CardLoreComponent from "./modals/CardLore.svelte";
  import type {ClientCard} from "@som/shared/types/game";

  let card: ClientCard;

  $: deckIndex = $playerStore.deckId;
  $: isGlowing = $playerStore.decks[deckIndex].klass === card.klass;

  const onSelectHero = (): void => {
    $playerStore.decks[deckIndex].klass = card.klass;
    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);

    soundService.play("card");
  };

  const onPreview = (): void => {
    modalService.open(CardLoreComponent, card);
    soundService.play("click");
  };

  export {card};
</script>

{#key $playerStore}
  <ClientCardComponent
    {card}
    {isGlowing}
    on:click="{onSelectHero}"
    on:contextmenu="{onPreview}"/>
{/key}
