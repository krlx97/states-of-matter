<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {slide, type SlideParams} from "svelte/transition";
  import {playerStore} from "stores";
  import BlockComponent from "./Block.svelte";
    import { ButtonComponent } from "ui";
    import { soundService } from "services";

  const slideParams: SlideParams = {
    duration: 400,
    easing: quadInOut
  };

  let isToggled = false;

  const onToggle = (): void => {
    isToggled = !isToggled;
    soundService.play("click");
  };
</script>

<style>
  .blocked {
    padding: var(--md);
  }

  .blocked__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .blocked__list {
    padding-top: var(--md);
    display: flex;
    flex-direction: column;
    gap: var(--md);
  }

  .chevron {
    transition: transform 400ms cubic-bezier(var(--ease-in-out-quad));
  }

  .isToggled {
    transform: rotate(180deg);
  }
</style>

<div class="blocked">

  <div class="blocked__toolbar">
    <div>Blocked <b>{$playerStore.social.blocked.length}</b></div>
    <ButtonComponent isIcon on:click="{onToggle}">
      <div class="chevron" class:isToggled>⯆</div>
    </ButtonComponent>
  </div>

  {#if isToggled}
    <div transition:slide="{slideParams}">
      {#if $playerStore.social.blocked.length}
        <div class="blocked__list">
          {#each $playerStore.social.blocked as name}
            <BlockComponent {name}/>
          {/each}
        </div>
      {:else}
        You haven't blocked anyone yet
      {/if}
    </div>
  {/if}

</div>
