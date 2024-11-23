<script lang="ts">
  import {soundService} from "services";
  import {deckCache, playerStore} from "stores";
  import {isDeckSame} from "./canSave";
  import ClientCardComponent from "./ClientCard.svelte";
  import type {ClientCard} from "@som/shared/types/game";

  let card: ClientCard;

  $: deckIndex = $playerStore.deckId;
  $: isGlowing = $playerStore.decks[deckIndex].klass === card.klass;

  const onSelectHero = (): void => {
    $playerStore.decks[deckIndex].klass = card.klass;
    isDeckSame($deckCache, $playerStore.decks[$playerStore.deckId]);
    soundService.play("card");
  };

  export {card};
</script>

{#key $playerStore}
  <ClientCardComponent {card} {isGlowing} on:click="{onSelectHero}"/>
{/key}
