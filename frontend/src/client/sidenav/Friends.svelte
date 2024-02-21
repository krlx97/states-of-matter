<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {slide, type SlideParams} from "svelte/transition";
  import {modalService, soundService} from "services";
  import {playerStore} from "stores";
  import AddFriendComponent from "./modals/AddFriend.svelte";
  import Friend from "./Friend.svelte";
    import { onMount } from "svelte";
    import { ButtonComponent, LinkComponent } from "ui";

  const slideParams: SlideParams = {
    duration: 400,
    easing: quadInOut
  };

  let isToggled = true;
  let isMenuToggled = false;

  let sortGroup: "name" | "rank" | "level" = "name";
  let sortAscending = false;

  const onAddFriend = (): void => {
    modalService.open(AddFriendComponent);
    soundService.play("click");
  };

  const onToggle = (): void => {
    isToggled = !isToggled;
    soundService.play("click");
  };
  const onMenuToggle = (): void => {
    isMenuToggled = !isMenuToggled;
  };

  const onSort = (group: "name" | "rank" | "level", ascending: boolean): void => {
    if (group === sortGroup) {
      sortAscending = !sortAscending;
    } else {
      sortGroup = group;
      sortAscending = true;
    }

    if (group === "name") {
      if (sortAscending) {
        $playerStore.social.friends.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        $playerStore.social.friends.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    if (group === "level") {
      if (sortAscending) {
        $playerStore.social.friends.sort((a, b) => a.level - b.level);
      } else {
        $playerStore.social.friends.sort((a, b) => b.level - a.level);
      }
    }

    if (group === "rank") {
      if (sortAscending) {
        $playerStore.social.friends.sort((a, b) => a.elo - b.elo);
      } else {
        $playerStore.social.friends.sort((a, b) => b.elo - a.elo);
      }
    }

    $playerStore.social.friends = $playerStore.social.friends;
    soundService.play("click");
  }

  const onSortNameAscending = (): void => {
    $playerStore.social.friends.sort((a, b) => a.elo - b.elo);
    $playerStore.social.friends = $playerStore.social.friends;
  };

  onMount((): void => {

  });
</script>

<style>
  .friends {
    padding: var(--md);
    /* account for 4px scrollbar */
    padding-right: 12px;
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }

  .friends__toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .friends__toolbar__actions {
    position: relative;
    display: flex;
    gap: var(--md);
  }

  .friends__list {
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

  .friends__toolbar__sort {
    display: flex;
    gap: var(--xs);
  }

  .arrow {
    border: solid white;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
  }
</style>

<div class="friends">

  <div class="friends__toolbar">
    <div>Friends <b>{$playerStore.social.friends.length}</b></div>
    <div class="friends__toolbar__sort">
      <LinkComponent color="{sortGroup === "name" ? "primary" : "white"}" on:click="{() => onSort("name", sortAscending ? false : true)}">
        Name
        {#if sortGroup === "name"}
          <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
        {/if}
      </LinkComponent>
      <LinkComponent color="{sortGroup === "rank" ? "primary" : "white"}" on:click="{() => onSort("rank", sortAscending ? false : true)}">
        Rank
        {#if sortGroup === "rank"}
          <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
        {/if}
      </LinkComponent>
      <LinkComponent color="{sortGroup === "level" ? "primary" : "white"}" on:click="{() => onSort("level", sortAscending ? false : true)}">
        Level
        {#if sortGroup === "level"}
          <div class="arrow" style:transform="{sortAscending ? "rotate(-135deg)" : "rotate(45deg)"}"></div>
        {/if}
      </LinkComponent>
    </div>
    <div class="friends__toolbar__actions">
      <ButtonComponent isIcon on:click="{onAddFriend}">
        +
      </ButtonComponent>
      <ButtonComponent isIcon on:click="{onToggle}">
        <div class="chevron" class:isToggled>⯆</div>
      </ButtonComponent>
    </div>
  </div>

  {#if isToggled}
    <div transition:slide="{slideParams}">
      {#if $playerStore.social.friends.length}
        <div class="friends__list">
          {#key $playerStore.social.friends}
            {#each $playerStore.social.friends as friend}
              <Friend {friend}/>
            {/each}
          {/key}
        </div>
      {:else}
        You have no friends yet
      {/if}
    </div>
  {/if}

</div>
