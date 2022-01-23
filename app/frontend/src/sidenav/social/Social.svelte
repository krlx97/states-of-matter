<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {slide} from "svelte/transition";
  import {miscService} from "shared/services";
  import {playerStore} from "stores/data";
  import {socialStore} from "stores/view";

  import Button from "../../ui/Button.svelte";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import Block from "./Block.svelte";
  import Friend from "./Friend.svelte";
  import Request from "./Request.svelte";

  import type {SlideParams} from "svelte/transition";

  let isFriendsToggled = true;
  let isRequestsToggled = false;
  let isBlockedToggled = false;

  $: friendsToggleIcon = isFriendsToggled ? "chevron-up" : "chevron-down";
  $: requestsToggleIcon = isRequestsToggled ? "chevron-up" : "chevron-down";
  $: blockedToggleIcon = isBlockedToggled ? "chevron-up" : "chevron-down";

  const transitionSlide: SlideParams = {
    duration: 333,
    easing: quadInOut
  }

  const addFriendModal = (): void => {
    miscService.openModal("addFriend");
  };

  const toggleFriends = (): void => {
    isFriendsToggled = !isFriendsToggled;
  };

  const toggleRequests = (): void => {
    isRequestsToggled = !isRequestsToggled;
  };

  const toggleBlocked = (): void => {
    isBlockedToggled = !isBlockedToggled;
  };
</script>

<style>
  main {
    flex-grow: 1;
  }
  section {
    border-bottom: 1px solid rgb(var(--light-grey));
  }
  header {
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .list {
    padding: var(--spacing-sm);
  }
</style>

<main>

  <section>
    <header>
      <p>
        Friends <b>{$playerStore.social.friends.length}</b>
      </p>
      <div>
        <Button style="icon" on:click={addFriendModal}>
          <FontAwesome icon="user-plus"/>
        </Button>
        <Button style="icon" on:click={toggleFriends}>
          <FontAwesome icon={friendsToggleIcon}/>
        </Button>
      </div>
    </header>
    {#if isFriendsToggled}
      <div class="list" transition:slide={transitionSlide}>
        {#if $playerStore.social.friends.length}
          {#each $socialStore.friends as friend}
            <Friend {friend}/>
          {/each}
        {:else}
          <span>You have no friends 😭</span>
        {/if}
      </div>
    {/if}
  </section>

  <section>
    <header>
      <p>
        Requests <b>{$playerStore.social.requests.length}</b>
      </p>
      <button class="btn--icon" on:click={toggleRequests}>
        <FontAwesome icon={requestsToggleIcon}/>
      </button>
    </header>
    {#if isRequestsToggled}
      <div class="list" transition:slide={transitionSlide}>
        {#if $playerStore.social.requests.length}
          {#each $playerStore.social.requests as username}
            <Request {username}/>
          {/each}
        {:else}
          <span>You have no friend requests 😢</span>
        {/if}
      </div>
    {/if}
  </section>

  <section>
    <header>
      <p>
        Blocked <b>{$playerStore.social.blocked.length}</b>
      </p>
      <button class="btn--icon" on:click={toggleBlocked}>
        <FontAwesome icon={blockedToggleIcon}/>
      </button>
    </header>
    {#if isBlockedToggled}
      <div class="list" transition:slide={transitionSlide}>
        {#if $playerStore.social.blocked.length}
          {#each $playerStore.social.blocked as username}
            <Block {username}/>
          {/each}
        {:else}
          <span>You haven't blocked anyone yet 😊</span>
        {/if}
      </div>
    {/if}
  </section>

</main>