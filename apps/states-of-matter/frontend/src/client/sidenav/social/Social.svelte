<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {slide, type SlideParams} from "svelte/transition";
  import {miscService} from "services";
  import {accountStore, playerStore, socialStore} from "stores"
  import Block from "./Block.svelte";
  import Friend from "./Friend.svelte";
  import Request from "./Request.svelte";

  let isFriendsToggled = true;
  let isRequestsToggled = false;
  let isBlockedToggled = false;

  const transitionSlide: SlideParams = {
    duration: 333,
    easing: quadInOut
  }

  $: friendsToggleIcon = isFriendsToggled ? "chevron-up" : "chevron-down";
  $: requestsToggleIcon = isRequestsToggled ? "chevron-up" : "chevron-down";
  $: blockedToggleIcon = isBlockedToggled ? "chevron-up" : "chevron-down";

  const addFriendModal = () => { miscService.openModal("addFriend"); };
  const toggleFriends = () => { isFriendsToggled = !isFriendsToggled; };
  const toggleRequests = () => { isRequestsToggled = !isRequestsToggled; };
  const toggleBlocked = () => { isBlockedToggled = !isBlockedToggled; };
</script>

<style>
  .social {
    flex-grow: 1;
  }

  .social__section {
    border-top-width: 0;
    border-right-width: 0;
    border-bottom-width: 1px;
    border-left-width: 0;
    border-style: solid;
    border-image: linear-gradient(
      90deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
    /* background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
    border-bottom: 2px solid rgb(var(--light-grey)); */
  }

  .social__section:first-child {
    border-top-width: 1px;
  }

  .social__section__toolbar {
    padding: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>

<div class="social">

  <div class="social__section">
    <div class="social__section__toolbar">
      <div>Friends <b>{$accountStore.social.friends.length}</b></div>
      <div style="display: flex;">
        <button class="button--icon" on:click={addFriendModal}>
          <img src="assets/icons/add-friend.png" alt="Add friend">
        </button>
        <button class="button--icon" on:click={toggleFriends}>
          <img src="assets/icons/up.png" alt="Add friend">
        </button>
      </div>
    </div>
    {#if isFriendsToggled}
      <div transition:slide={transitionSlide}>
        {#if $accountStore.social.friends.length}
          {#each $socialStore.friends as friend}
            <Friend {friend}/>
          {/each}
        {:else}
          <div style="padding: 1em;">You have no friends 😭</div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="social__section">
    <div class="social__section__toolbar">
      <div>Requests <b>{$accountStore.social.requests.length}</b></div>
      <button class="button--icon" on:click={toggleRequests}>
        <img src="assets/icons/down.png" alt="Down">
      </button>
    </div>
    {#if isRequestsToggled}
      <div transition:slide={transitionSlide}>
        {#if $accountStore.social.requests.length}
          {#each $accountStore.social.requests as username}
            <Request {username}/>
          {/each}
        {:else}
          <div style="padding: 1em;">You have no friend requests 😢</div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="social__section">
    <div class="social__section__toolbar">
      <div>Blocked <b>{$accountStore.social.blocked.length}</b></div>
      <button class="button--icon" on:click={toggleBlocked}>
        <img src="assets/icons/down.png" alt="Down">
      </button>
    </div>
    {#if isBlockedToggled}
      <div transition:slide={transitionSlide}>
        {#if $accountStore.social.blocked.length}
          {#each $accountStore.social.blocked as username}
            <Block {username}/>
          {/each}
        {:else}
          <div style="padding: 1em;">You haven't blocked anyone yet 😊</div>
        {/if}
      </div>
    {/if}
  </div>

</div>
