<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {slide, type SlideParams} from "svelte/transition";
  import {playerStore} from "stores";
  import RequestComponent from "./Request.svelte";
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
  .requests {
    padding: var(--md);
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }

  .requests__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .requests__list {
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

<div class="requests">

  <div class="requests__toolbar">
    <div>Requests <b>{$playerStore.social.requests.length}</b></div>
    <ButtonComponent isIcon on:click="{onToggle}">
      <div class="chevron" class:isToggled>⯆</div>
    </ButtonComponent>
  </div>

  {#if isToggled}
    <div transition:slide="{slideParams}">
      {#if $playerStore.social.requests.length}
        <div class="requests__list">
          {#each $playerStore.social.requests as name}
            <RequestComponent {name}/>
          {/each}
        </div>
      {:else}
        You have no friend requests
      {/if}
    </div>
  {/if}

</div>
