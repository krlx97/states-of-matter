<script lang="ts">
  import {GameType, PlayerStatus, QueueId} from "@som/shared/enums";
  import {modalService, socketService, soundService} from "services";
  import {gameStore, lobbyStore, playerStore} from "stores";
  import {PlayerFrameComponent} from "ui";
  import SettingsComponent from "./modals/Settings.svelte";
  import TasksComponent from "./modals/Tasks.svelte";
  import SelectAvatarComponent from "./modals/SelectAvatar/SelectAvatar.svelte";
  import SelectBannerComponent from "./modals/SelectBanner/SelectBanner.svelte";

  const onTasks = (): void => {
    modalService.open(TasksComponent);
    soundService.play("click");
  };

  const onEditProfile = (): void => {
    modalService.open(SettingsComponent);
    soundService.play("click");
  };

  const onSetAvatar = (): void => {
    modalService.open(SelectAvatarComponent);
    soundService.play("click");
  };

  const onSetBanner = (): void => {
    modalService.open(SelectBannerComponent);
    soundService.play("click");
  };

  const onSignout = (): void => {
    soundService.play("click");

    const token = localStorage.getItem("jsonwebtoken");

    if (token) {
      localStorage.removeItem("jsonwebtoken");
    }

    playerStore.set({
      address: "",
      nonce: 0,
      name: "",
      joinedAt: Date.now(),
      status: PlayerStatus.OFFLINE,
      experience: 0,
      level: 1,
      elo: 500,
      avatarId: 1000,
      bannerId: 5000,
      deckId: 0, // should be called deckIndex, because this is actually index.
      queueId: QueueId.NONE,
      lobbyId: 0,
      gameId: 0,
      gamePopupId: 0,
      games: {
        casual: {won: 0, lost: 0},
        ranked: {won: 0, lost: 0},
        custom: {won: 0, lost: 0}
      },
      friends: [],
      mutualFriends: [],
      tasks: {
        daily: false,
        weekly: 0,
        dailyAlternative: 0
      },
      rewards: {
        ecr: "0",
        ees: "0"
      },
      tutorial: {
        deckBuilder: false,
        game: false,
        play: false,
        inventory: false
      },
      decks: [],
      skins: []
    });

    lobbyStore.set({
      id: 0,
      messages: [],
      host: {
        name: "",
        experience: 0,
        level: 0,
        elo: 0,
        avatarId: 0,
        bannerId: 0,
        games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}, custom: {won: 0, lost: 0}},
      },
      challengee: {
        name: "",
        experience: 0,
        level: 0,
        elo: 0,
        avatarId: 0,
        bannerId: 0,
        games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}, custom: {won: 0, lost: 0}},
      }
    });

    gameStore.set({
      id: 0,
      type: GameType.CUSTOM,
      currentPlayer: "",
      currentTurn: 0,
      gameLogs: [],
      player: {
        name: "",
        field: {
          hero: {
            id: 50,
            gid: 0,
            type: 0,
            klass: 0,
            health: {current: 0, default: 0},
            mana: {current: 0, default: 0},
            ability: 0,
            effect: 0,
            buffs: [],
            debuffs: []
          },
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined
        },
        trap: undefined,
        deck: 0,
        hand: [],
        graveyard: [],
        skins: []
      },
      opponent: {
        name: "",
        field: {
          hero: {
            id: 50,
            gid: 0,
            type: 0,
            klass: 0,
            health: {current: 0, default: 0},
            mana: {current: 0, default: 0},
            ability: 0,
            effect: 0,
            buffs: [],
            debuffs: []
          },
          a: undefined,
          b: undefined,
          c: undefined,
          d: undefined
        },
        trap: false,
        deck: 0,
        hand: 0,
        graveyard: [],
        skins: []
      }
    });

    socketService.socket.disconnect();
  };

  const actions = [
    ["Tasks", onTasks],
    ["Avatars", onSetAvatar],
    ["Banners", onSetBanner],
    ["Settings", onEditProfile],
    ["Sign out", onSignout]
  ];
</script>

<style>
  .player {
    padding: var(--md);
    border: 0 solid;
    border-bottom-width: 1px;
    border-image: linear-gradient(
      90deg,
      rgba(var(--dark-grey), 0) 0%,
      rgba(var(--grey), 0.333) 50%,
      rgba(var(--dark-grey), 0) 100%
    ) 1;
  }
</style>

<div class="player">
  {#key $playerStore}
    <PlayerFrameComponent
      {actions}
      name="{$playerStore.name}"
      experience="{$playerStore.experience}"
      level="{$playerStore.level}"
      elo="{$playerStore.elo}"
      avatarId="{$playerStore.avatarId}"
      bannerId="{$playerStore.bannerId}"
      games="{$playerStore.games}"/>
  {/key}
</div>
