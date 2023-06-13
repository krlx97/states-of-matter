<script lang="ts">
  import {onMount} from "svelte";
  import {quadInOut} from "svelte/easing";
  import {slide, type SlideParams} from "svelte/transition";
  import {modalService} from "services";
  import {accountStore} from "stores"
  import BlockComponent from "./Block.svelte";
  import FriendComponent from "./Friend.svelte";
  import RequestComponent from "./Request.svelte";
  import AddFriendComponent from "./modals/AddFriend.svelte";

  let isFriendsToggled = true;
  let isRequestsToggled = false;
  let isBlockedToggled = false;

  const transitionSlide: SlideParams = {
    duration: 500,
    easing: quadInOut
  }

  let friendsToggleIcon: HTMLElement;
  let requestsToggleIcon: HTMLElement;
  let blockedToggleIcon: HTMLElement;

  const onAddFriend = (): void => {
    modalService.open(AddFriendComponent);
  };

  const onToggleFriends = (): void => {
    isFriendsToggled = !isFriendsToggled;
    const rotation = isFriendsToggled ? "180" : "0";
    friendsToggleIcon.style.transform = `rotate(${rotation}deg)`;
  };

  const toggleRequests = (): void => {
    isRequestsToggled = !isRequestsToggled;
    const rotation = isRequestsToggled ? "180" : "0";
    requestsToggleIcon.style.transform = `rotate(${rotation}deg)`;
  };

  const toggleBlocked = (): void => {
    isBlockedToggled = !isBlockedToggled;
    const rotation = isBlockedToggled ? "180" : "0";
    blockedToggleIcon.style.transform = `rotate(${rotation}deg)`;
  };

  onMount((): void => {
    friendsToggleIcon.style.transform = "rotate(180deg)";
  });
</script>

<style>
  .social {
    flex-grow: 1;
    overflow-y: scroll;
  }

 .social::-webkit-scrollbar {
    width: 8px;
  }

  .social::-webkit-scrollbar-track {
    background-color: rgb(63, 63, 63);
    border-radius: 8px;
  }

  .social::-webkit-scrollbar-thumb {
    background-color: rgb(127, 127, 127);
    border-radius: 8px;
  }

  .social__section {
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }

  .social__section__toolbar {
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .social__section__toolbar__actions {
    display: flex;
    gap: var(--spacing-md);
  }

  .social__section__list {
    padding: var(--spacing-md);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .chevron {
    transition: transform 500ms cubic-bezier(var(--ease-in-out-quad));
  }
</style>

<div class="social">

  <div class="social__section">
    <div class="social__section__toolbar">
      <div>Friends <b>{$accountStore.social.friends.length}</b></div>
      <div class="social__section__toolbar__actions">
        <button class="button--icon" on:click={onAddFriend}>
          <i class="fa-solid fa-user-plus"></i>
        </button>
        <button class="button--icon" on:click={onToggleFriends}>
          <i
            class="fa-solid fa-chevron-down chevron"
            bind:this={friendsToggleIcon}
          ></i>
        </button>
      </div>
    </div>
    {#if isFriendsToggled}
      <div class="social__section__list" transition:slide={transitionSlide}>
        {#if $accountStore.social.friends.length}
          {#each $accountStore.social.friends as friend}
            <FriendComponent {friend}/>
          {/each}
        {:else}
          You have no friends yet
        {/if}
      </div>
    {/if}
  </div>

  <div class="social__section">
    <div class="social__section__toolbar">
      <div>Requests <b>{$accountStore.social.requests.length}</b></div>
      <button class="button--icon" on:click={toggleRequests}>
        <i
          class="fa-solid fa-chevron-down chevron"
          bind:this={requestsToggleIcon}
        ></i>
      </button>
    </div>
    {#if isRequestsToggled}
      <div class="social__section__list" transition:slide={transitionSlide}>
        {#if $accountStore.social.requests.length}
          {#each $accountStore.social.requests as name}
            <RequestComponent {name}/>
          {/each}
        {:else}
          You have no friend requests
        {/if}
      </div>
    {/if}
  </div>

  <div class="social__section">
    <div class="social__section__toolbar">
      <div>Blocked <b>{$accountStore.social.blocked.length}</b></div>
      <button class="button--icon" on:click={toggleBlocked}>
        <i
          class="fa-solid fa-chevron-down chevron"
          bind:this={blockedToggleIcon}
        ></i>
      </button>
    </div>
    {#if isBlockedToggled}
      <div class="social__section__list" transition:slide={transitionSlide}>
        {#if $accountStore.social.blocked.length}
          {#each $accountStore.social.blocked as name}
            <BlockComponent {name}/>
          {/each}
        {:else}
          You haven't blocked anyone yet
        {/if}
      </div>
    {/if}
  </div>

</div>
