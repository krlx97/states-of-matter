<script lang="ts">
  import {modalService, soundService} from "services";
  import {playerStore} from "stores";
  import {ButtonComponent, LinkComponent} from "ui";
  import Friend from "./Friend.svelte";
  import AddFriendComponent from "./modals/AddFriend.svelte";

  let sortGroup: "name" | "rank" | "level" = "name";
  let sortAscending = false;

  const onAddFriend = (): void => {
    modalService.open(AddFriendComponent);
    soundService.play("click");
  };

  const onSort = (group: "name" | "rank" | "level"): void => {
    if (group === sortGroup) {
      sortAscending = !sortAscending;
    } else {
      sortGroup = group;
      sortAscending = true;
    }

    if (group === "name") {
      if (sortAscending) {
        $playerStore.friends.sort((a, b) => a.name.localeCompare(b.name));
      } else {
        $playerStore.friends.sort((a, b) => b.name.localeCompare(a.name));
      }
    }

    if (group === "level") {
      if (sortAscending) {
        $playerStore.friends.sort((a, b) => a.level - b.level);
      } else {
        $playerStore.friends.sort((a, b) => b.level - a.level);
      }
    }

    if (group === "rank") {
      if (sortAscending) {
        $playerStore.friends.sort((a, b) => a.elo - b.elo);
      } else {
        $playerStore.friends.sort((a, b) => b.elo - a.elo);
      }
    }

    $playerStore.friends = $playerStore.friends;
    soundService.play("click");
  };
</script>

<style>
  .friends {
    padding: var(--md);
    /* account for 4px scrollbar */
    padding-right: 12px;
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

  .friends__toolbar__sort {
    display: flex;
    gap: var(--xs);
  }
</style>

<div class="friends">

  <div class="friends__toolbar">
    <div>Friends <b>{$playerStore.friends.length}</b></div>
    <div class="friends__toolbar__sort">
      <LinkComponent color="{sortGroup === "name" ? "primary" : "white"}" on:click="{() => onSort("name")}">
        Name
        {#if sortGroup === "name"}
          <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
        {/if}
      </LinkComponent>
      <LinkComponent color="{sortGroup === "rank" ? "primary" : "white"}" on:click="{() => onSort("rank")}">
        Rank
        {#if sortGroup === "rank"}
          <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
        {/if}
      </LinkComponent>
      <LinkComponent color="{sortGroup === "level" ? "primary" : "white"}" on:click="{() => onSort("level")}">
        Level
        {#if sortGroup === "level"}
          <i class="fa-solid fa-sort-{sortAscending ? "up" : "down"}"></i>
        {/if}
      </LinkComponent>
    </div>
    <div class="friends__toolbar__actions">
      <ButtonComponent type="button" isIcon on:click="{onAddFriend}">
        <i class="fa-solid fa-user-plus"></i>
      </ButtonComponent>
    </div>
  </div>

  {#if $playerStore.friends.length}
    <div class="friends__list">
      {#key $playerStore.friends}
        {#each $playerStore.friends as friend}
          <Friend {friend}/>
        {/each}
      {/key}
    </div>
  {:else}
    You have no friends yet
  {/if}

</div>
