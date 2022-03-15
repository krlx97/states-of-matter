<script lang="ts">
  import {quadInOut} from "svelte/easing";
  import {slide} from "svelte/transition";
  import {miscService} from "shared/services";
  import {playerStore} from "stores/data";
  import {socialStore} from "stores/view";

  import Button from "../../ui/Button.svelte";
  import FontAwesome from "../../ui/FontAwesome.svelte";
  import Text from "../../ui/Text.svelte";

  import Block from "./Block.svelte";
  import Friend from "./Friend.svelte";
  import Request from "./Request.svelte";

  import type {SlideParams} from "svelte/transition";

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

  const addFriendModal = (): void => { miscService.openModal("addFriend"); };
  const toggleFriends = (): void => { isFriendsToggled = !isFriendsToggled; };
  const toggleRequests = (): void => { isRequestsToggled = !isRequestsToggled; };
  const toggleBlocked = (): void => { isBlockedToggled = !isBlockedToggled; };
</script>

<style lang="scss">
  @import "../../shared/styles/mixins";
  @import "../../shared/styles/variables";

  .social {
    flex-grow: 1;

    &__section {
      border-bottom: 2px solid $light-grey;

      &__toolbar {
        padding: $spacing-sm;
        @include flex($align-items: center, $justify-content: space-between);
      }
    }
  }
</style>

<div class="social">

  <div class="social__section">
    <div class="social__section__toolbar">
      <Text size="xlg">Friends <b>{$playerStore.social.friends.length}</b></Text>
      <div>
        <Button style="icon" on:click={addFriendModal}>
          <FontAwesome icon="user-plus"/>
        </Button>
        <Button style="icon" on:click={toggleFriends}>
          <FontAwesome icon={friendsToggleIcon}/>
        </Button>
      </div>
    </div>
    {#if isFriendsToggled}
      <div transition:slide={transitionSlide}>
        {#if $playerStore.social.friends.length}
          {#each $socialStore.friends as friend}
            <Friend {friend}/>
          {/each}
        {:else}
          <Text>You have no friends 😭</Text>
        {/if}
      </div>
    {/if}
  </div>

  <div class="social__section">
    <div class="social__section__toolbar">
      <Text size="xlg">Requests <b>{$playerStore.social.requests.length}</b></Text>
      <Button style="icon" on:click={toggleRequests}>
        <FontAwesome icon={requestsToggleIcon}/>
      </Button>
    </div>
    {#if isRequestsToggled}
      <div transition:slide={transitionSlide}>
        {#if $playerStore.social.requests.length}
          {#each $playerStore.social.requests as username}
            <Request {username}/>
          {/each}
        {:else}
          <Text>You have no friend requests 😢</Text>
        {/if}
      </div>
    {/if}
  </div>

  <div class="social__section">
    <div class="social__section__toolbar">
      <Text size="xlg">Blocked <b>{$playerStore.social.blocked.length}</b></Text>
      <Button style="icon" on:click={toggleBlocked}>
        <FontAwesome icon={blockedToggleIcon}/>
      </Button>
    </div>
    {#if isBlockedToggled}
      <div transition:slide={transitionSlide}>
        {#if $playerStore.social.blocked.length}
          {#each $playerStore.social.blocked as username}
            <Block {username}/>
          {/each}
        {:else}
          <Text>You haven't blocked anyone yet 😊</Text>
        {/if}
      </div>
    {/if}
  </div>

</div>
