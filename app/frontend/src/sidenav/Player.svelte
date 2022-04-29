<script lang="ts">
  import {onMount} from "svelte";
  import {PlayerStatus} from "@som/shared/enums";
  import {socketService} from "services";
  import {playerStore, socialStore} from "stores";

  import Button from "../ui/Button.svelte";
  import Img from "../ui/Img.svelte";
  import Text from "../ui/Text.svelte";

  const logout = (): void => {
    // socketService.socket.emit("signout");
    socketService.socket.emit("updateStatus");

    $playerStore = {
      socketId: "",
      username: "",
      publicKey: "",
      privateKey: "",
      last_nonce: 0,
      privateKeyHash: "",
      status: PlayerStatus.OFFLINE,
      xp: 0,
      lv: 1,
      deckId: 0,
      avatarId: 0,
      lobbyId: 0,
      gameId: 0,
      decks: [],
      social: {
        friends: [],
        requests: [],
        blocked: []
      },
      wallet: []
    };

    $socialStore = {
      friends: [],
      chat: {
        username: "",
        status: PlayerStatus.OFFLINE,
        avatarId: 0,
        isOpen: false,
        messages: []
      }
    };
  };

  let xpProgressLen;

  $:xpRequired = Math.pow($playerStore.lv * 10, $playerStore.lv / 100 + 1)
  $:xpOffset = xpProgressLen - (xpProgressLen * ($playerStore.xp / xpRequired));

  onMount((): void => {
    const xpProgress: any = document.getElementById("xpProgress");
    xpProgressLen = xpProgress.getTotalLength();
  });
</script>

<style lang="scss">
  @import "../shared/styles/mixins";
  @import "../shared/styles/variables";

  .player {
    height: 128px;
    padding: $spacing-md;
    @include flex($align-items: center);
    border-bottom: 2px solid $light-grey;
    box-sizing: border-box;
  }

  .player__main {
    position: relative;
    margin-right: $spacing-md;
  }
  .player__main__img {
    height: 96px;
    width: 96px;
    border-radius: 50%;
    cursor: pointer;
  }
  .player__main__bar {
    position: absolute;
    top: 0;
    left: 0;
  }

  .player__account {
    flex-grow: 1;
    @include flex(column);
  }

  #xpProgress {
    stroke-dasharray: 237.7561492919922;
    stroke-dashoffset: 0;
    transition: stroke-dashoffset 1s ease;
  }
</style>

<div class="player">

  <div class="player__main">
    <img
      class="player__main__img"
      src="assets/avatars/{$playerStore.avatarId}.png"
      alt="Avatar">

    <div class="player__main__bar">
      <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M31.1619 88.6507C21.7572 84.7551 13.9941 77.7191 9.19545 68.7414C4.39681 59.7638 2.8595 49.4 4.84545 39.416C6.8314 29.432 12.2177 20.4454 20.0867 13.9875C27.9557 7.52964 37.8204 4 48 4C58.1796 4 68.0444 7.52966 75.9133 13.9875C83.7823 20.4454 89.1686 29.432 91.1546 39.416C93.1405 49.4001 91.6032 59.7638 86.8045 68.7415C82.0059 77.7191 74.2428 84.7551 64.8381 88.6507" stroke="#424242" stroke-width="8"/>
        <path id="xpProgress" style="stroke-dashoffset: {xpOffset}" d="M29.1269 87.7468C20.0919 83.4567 12.7882 76.2164 8.41946 67.2193C4.05068 58.2221 2.87756 48.0051 5.09343 38.2519C7.3093 28.4987 12.7819 19.7915 20.6094 13.5652C28.4368 7.33902 38.1519 3.96536 48.1536 4.00027C58.1553 4.03518 67.8466 7.47658 75.6304 13.7573C83.4142 20.038 88.8259 28.7832 90.9736 38.5516C93.1213 48.3201 91.8769 58.5287 87.4454 67.4951C83.0139 76.4616 75.6599 83.6506 66.5952 87.8775" stroke="#796CFF" stroke-width="4"/>
      </svg>
    </div>
  </div>

  <div class="player__account">
    <Text size="lg">{$playerStore.username}</Text>
    <Text>Level {$playerStore.lv}</Text>
    <Text color="purple">{$playerStore.xp} / {xpRequired}</Text>
  </div>

  <div>
    <Button style="icon" on:click={logout}>
      <i class="fas fa-power-off"></i>
    </Button>
  </div>

</div>
