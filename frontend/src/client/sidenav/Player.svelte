<script lang="ts">
  import {PlayerStatus, QueueId} from "@som/shared/enums";
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
        ranked: {won: 0, lost: 0}
      },
      social: {
        friends: [],
        requests: [],
        blocked: []
      },
      quests: {
        daily: false,
        weekly: 0,
        dailyAlternative: 0
      },
      rewards: {
        chests: "0",
        ecr: "0",
        ees: "0",
        shards: "0",
        skins: "0"
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
      host: {
        name: "",
        experience: 0,
        level: 0,
        elo: 0,
        avatarId: 0,
        bannerId: 0,
        games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}}
      },
      challengee: {
        name: "",
        experience: 0,
        level: 0,
        elo: 0,
        avatarId: 0,
        bannerId: 0,
        games: {casual: {won: 0, lost: 0}, ranked: {won: 0, lost: 0}}
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
            gid: 0,
            id: 0,
            type: 0,
            name: "",
            klass: 0,
            health: 0,
            maxHealth: 0,
            mana: 0,
            maxMana: 0,
            ability: 0
            ,effect: 0,
            buffs: [],
            debuffs: []
          },

          a: undefined, b: undefined, c: undefined, d: undefined},
        trap: undefined,
        deck: 0,
        hand: [],
        graveyard: [],
        selectedSkins: {
          avatars: [],
          border: 0,
          back: 0
        }
      },
      opponent: {
        name: "",
        field: {
          hero: {
            gid: 0,
            id: 0,
            type: 0,
            name: "",
            klass: 0,
            health: 0,
            maxHealth: 0,
            mana: 0,
            maxMana: 0,
            ability: 0
            ,effect: 0,
            buffs: [],
            debuffs: []
          },

          a: undefined, b: undefined, c: undefined, d: undefined},
        trap: false,
        deck: 0,
        hand: 0,
        graveyard: [],
        selectedSkins: {
          avatars: [],
          border: 0,
          back: 0
        }
      }
    });

    socketService.socket.disconnect();

    // location.reload();
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
      rgba(63, 63, 63, 1) 0%,
      rgba(255, 255, 255, 1) 50%,
      rgba(63, 63, 63, 1) 100%
    ) 1;
  }
</style>

<div class="player">
  <PlayerFrameComponent
    {actions}
    name="{$playerStore.name}"
    experience="{$playerStore.experience}"
    level="{$playerStore.level}"
    elo="{$playerStore.elo}"
    avatarId="{$playerStore.avatarId}"
    bannerId="{$playerStore.bannerId}"
    games="{$playerStore.games}"/>
</div>
