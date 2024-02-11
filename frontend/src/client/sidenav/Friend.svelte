<script lang="ts">
  import {modalService, socketService, soundService} from "services";
  import {chatStore, playerStore} from "stores";
  import {PlayerFrameComponent} from "ui";
  import RemoveFriendComponent from "./modals/RemoveFriend.svelte";
  import BlockFriendComponent from "./modals/BlockFriend.svelte";
  import type {PlayerSocialFriendView} from "@som/shared/types/views";

  let friend: PlayerSocialFriendView;
  const {name} = friend;

  const onRemoveFriend = (): void => {
    modalService.open(RemoveFriendComponent, {name});
    soundService.play("click");
  };

  const onBlockFriend = (): void => {
    modalService.open(BlockFriendComponent, {name});
    soundService.play("click");
  };

  const onChat = (): void => {
    const {lastSender, unseen, messages} = friend.chat;

    if ($chatStore.name === name) {
      $chatStore.isOpen = true;
    } else {
      const isOpen = true;
      $chatStore = {name, isOpen, messages};
    }

    if (lastSender === name && unseen > 0) {
      socketService.socket.emit("readChatMessages", {name});
    }
    soundService.play("click");
  };

  $: hasUnseenMessages = friend.chat.unseen > 0 && (friend.chat.lastSender !== $playerStore.name);

//friend.chat.unseen && friend.chat.lastSender !== $playerStore.name
  const actions = [
    ["Chat", onChat],
    ["Remove", onRemoveFriend],
    ["Block", onBlockFriend],
  ];

  export {friend};
</script>

{#key friend}
  <PlayerFrameComponent
    {actions}
    {hasUnseenMessages}
    name="{friend.name}"
    experience="{friend.experience}"
    level="{friend.level}"
    elo="{friend.elo}"
    avatarId="{friend.avatarId}"
    bannerId="{friend.bannerId}"
    status="{friend.status}"
    games="{friend.games}"/>
{/key}
