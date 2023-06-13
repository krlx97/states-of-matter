<script lang="ts">
  import {playerStore} from "stores";
  import LobbyComponent from "./Lobby.svelte";
  import SelectModeComponent from "./SelectMode.svelte";
    import { TutorialComponent } from "ui";
    import PlayTutorial1 from "./Tutorial/PlayTutorial1.svelte";
    import PlayTutorial2 from "./Tutorial/PlayTutorial2.svelte";
    import PlayTutorial3 from "./Tutorial/PlayTutorial3.svelte";

  $: isDeckValid = $playerStore.decks[$playerStore.deckId].cardsInDeck === 30;

</script>

<style>
  .play {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>

<div class="play">
  {#if $playerStore.lobbyId > 0}
    <LobbyComponent/>
  {:else}
    <SelectModeComponent/>
  {/if}
</div>

{#if !$playerStore.tutorial.play && isDeckValid}
  <TutorialComponent tutorial="play" steps={[{
    position: "top: 272px; left: 550px",
    component: PlayTutorial1
  }, {
    position: "top: 272px; left: 920px;",
    component: PlayTutorial2
  }, {
    position: "top: 272px; left: 1290px;",
    component: PlayTutorial3
  }]}/>
{/if}
