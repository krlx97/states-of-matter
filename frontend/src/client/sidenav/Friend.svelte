<script lang="ts">
  import {modalService, soundService} from "services";
  import {playerStore} from "stores";
  import {PlayerFrameComponent} from "ui";
  import RemoveFriendComponent from "./modals/RemoveFriend.svelte";
  import type {PlayerSocialFriendView} from "@som/shared/types/views";

  let friend: PlayerSocialFriendView;
  const {name} = friend;

  $: isMutual = $playerStore.mutualFriends.includes(name);

  const onRemoveFriend = (): void => {
    modalService.open(RemoveFriendComponent, {name});
    soundService.play("click");
  };

  const actions = [["Remove", onRemoveFriend]];

  export {friend};
</script>

{#key friend}
  <PlayerFrameComponent
    {actions}
    {isMutual}
    name="{friend.name}"
    experience="{friend.experience}"
    level="{friend.level}"
    elo="{friend.elo}"
    avatarId="{friend.avatarId}"
    bannerId="{friend.bannerId}"
    status="{friend.status}"
    games="{friend.games}"/>
{/key}
