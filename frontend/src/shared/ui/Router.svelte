<script lang="ts">
  import { soundService } from "services";
  import type {ComponentType} from "svelte";
  import { LinkComponent } from "ui";

  let views: Array<{name: string, component: ComponentType, props: any}>;
  let currentView = views[0];

  const onChangeView = (view: any): void => {
    soundService.play("click");
    currentView = view;
  };

  export {views};
</script>

<style>
  .router {
    height: 100%;
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    gap: var(--md);
  }

  .router__nav {
    display: flex;
    gap: var(--md);
    justify-content: center;
  }

  .router__content {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<div class="router">
  <div class="router__nav">
    {#each views as view}
      <LinkComponent
        color="white"
        isActive="{view === currentView}"
        on:click="{() => onChangeView(view)}">
        {view.name}
      </LinkComponent>
    {/each}
  </div>
  <div class="router__content">
    <svelte:component this="{currentView.component}" {...currentView.props}/>
  </div>
</div>
