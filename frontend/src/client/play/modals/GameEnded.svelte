<script lang="ts">
  import {onMount} from "svelte";
  import {fade} from "svelte/transition";
  import {GameType} from "@som/shared/enums";
  import {accountStore, modalStore, playerStore} from "stores";
  import {ItemComponent, ModalComponent} from "ui";
    import { modalService } from "services";

  const {isWinner, gameType, experience, elo} = $modalStore.data;
  let xpProgressLen;
  const shard = {
    id: 1015,
    name: "Guiding Lights Uncommon Shard",
    type: 1,
    rarity: 0,
    craftPrice: 50
  };
  const chest = {
    id: 10,
  name: "Mega Chest",
  type: 0,
  };

  $: xpRequired = 1000 + ($playerStore.level % 10) * 100;
  $: xpOffset = xpProgressLen - (xpProgressLen * ($playerStore.experience / xpRequired));

  let isLevelup = false;
  let isFinished = false;

  const onClose = (): void => {
    modalService.close();
  };

  onMount((): void => {
    const xpProgress: any = document.getElementById("xpProgress2");
    xpProgressLen = xpProgress.getTotalLength();

    setTimeout((): void => {
      const animateValue = (): void => {
        let sum = 0;
        let sum2 = 0;

        const step2 = (): void => {
          if (elo < 0) { // lost elo
            $playerStore.elo -= 1;
            sum2 -= 1;

            if (sum2 > elo) {
              setTimeout(() => {
                requestAnimationFrame(step2);
              }, 100);
            }
          } else { // gained elo
            $playerStore.elo += 1;
            sum2 += 1;

            if (sum2 < elo) {
              setTimeout(() => {
                requestAnimationFrame(step2);
              }, 100);
            } else {
              isFinished = true;
            }
          }
        };

        const step = (): void => {
          $playerStore.experience += 1;
          sum += 1;

          if ($playerStore.experience > xpRequired) {
            $playerStore.experience = 0;
            $playerStore.level += 1;
            isLevelup = true;
          }

          if (sum < experience) {
            requestAnimationFrame(step);
          } else {
            if (gameType === GameType.RANKED) {
              requestAnimationFrame(step2);
              isLevelup = true;
            } else {
              isFinished = true;
            }
          }
        };

        window.requestAnimationFrame(step);
      }

      animateValue();
    }, 1000);
  });
</script>

<style>
  .game-ended {
    width: 352px;
  }

  h1 {
    text-align: center;
  }

  .game-ended__profile {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-top: var(--spacing-md);
  }

  .player__main {
    position: relative;
    height: 96px;
    width: 96px;
    /* padding-right: var(--spacing-md); */
    /* flex-basis: 50%; */
    margin: 0 auto;
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; */
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

  #xpProgress2 {
    stroke-dasharray: 237.7561492919922;
    stroke-dashoffset: 0;
    /* transition: stroke-dashoffset 1s ease; */
  }

  .rank__img {
    height: 96px;
    width: 96px;
    margin: 0 auto;
  }

  .player__rank {
    flex-basis: 50%;
  }

  .levelup {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* justify-content: center; */
    gap: var(--spacing-md);
    margin-top: var(--spacing-md);
    /* font-size: var(--font-xlg);
    text-align: center; */
  }


  .assets {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
    width: 100%;
  }

  .reward-asset {
    padding: var(--spacing-md);
    border: 1px solid rgb(127, 127, 127);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    font-size: var(--font-lg);
border-radius: 8px;
  flex-basis: 50%;
  }
</style>

<ModalComponent dark={true} isClosable={false}>
  <div class="game-ended">
    <h1>
      {#if isWinner}
        <div class="green">YOU WON!</div>
      {:else}
        <div class="red">YOU LOST...</div>
      {/if}
    </h1>
    {#if gameType === GameType.CASUAL || gameType === GameType.RANKED}

    <table class="token-modal__table">
      <tr>
        <td>EXPERIENCE</td><td>+{experience}</td>
      </tr>
      {#if gameType === GameType.RANKED}
        <tr>
          <td>ELO</td><td>{elo}</td>
        </tr>
      {/if}
    </table>
    {/if}
    <div class="game-ended__profile">
      {#if gameType === GameType.CASUAL || gameType === GameType.RANKED}
      <div style="flex-basis: 50%;" >

        <div class="player__main">
          <img
            class="player__main__img"
            src="assets/avatars/{$accountStore.avatarId}.png"
            alt="Avatar"
          />

          <div class="player__main__bar">
            <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M31.1619 88.6507C21.7572 84.7551 13.9941 77.7191 9.19545 68.7414C4.39681 59.7638 2.8595 49.4 4.84545 39.416C6.8314 29.432 12.2177 20.4454 20.0867 13.9875C27.9557 7.52964 37.8204 4 48 4C58.1796 4 68.0444 7.52966 75.9133 13.9875C83.7823 20.4454 89.1686 29.432 91.1546 39.416C93.1405 49.4001 91.6032 59.7638 86.8045 68.7415C82.0059 77.7191 74.2428 84.7551 64.8381 88.6507" stroke="#424242" stroke-width="8"/>
              <path id="xpProgress2" style="stroke-dashoffset: {xpOffset}" d="M29.1269 87.7468C20.0919 83.4567 12.7882 76.2164 8.41946 67.2193C4.05068 58.2221 2.87756 48.0051 5.09343 38.2519C7.3093 28.4987 12.7819 19.7915 20.6094 13.5652C28.4368 7.33902 38.1519 3.96536 48.1536 4.00027C58.1553 4.03518 67.8466 7.47658 75.6304 13.7573C83.4142 20.038 88.8259 28.7832 90.9736 38.5516C93.1213 48.3201 91.8769 58.5287 87.4454 67.4951C83.0139 76.4616 75.6599 83.6506 66.5952 87.8775" stroke="#796CFF" stroke-width="4"/>
            </svg>
          </div>
        </div>
        <table><tr><td>LEVEL</td><td>{$playerStore.level}</td></tr><tr><td>XP</td><td id="xddd">{$playerStore.experience}</td></tr></table>
        <!-- Level: {$playerStore.level}
        Experience: {$playerStore.experience} -->
      </div>
      {/if}
      {#if gameType === GameType.RANKED}
      <div class="player__rank">
        <img class="rank__img" src="assets/ranks/{"silver"}.png" alt="{"silver"}"/>
        <table>
          <tr>
            <td>RANK</td><td>Silver</td>
          </tr>
          <tr>
            <td>ELO</td><td id="dxxx">{$playerStore.elo}</td>
          </tr>
        </table>
      </div>
      {/if}
    </div>

    {#if isLevelup}
      <div class="levelup" in:fade>
        LEVEL UP REWARDS<br/>
        <div class="assets">
          <div class="reward-asset" in:fade={{delay: 500, duration: 500}}>
            <img src="assets/currencies/crystal.png" height=48 width=48/>
            <div>1500</div>
          </div>
          <div class="reward-asset" in:fade={{delay: 1000, duration: 500}}>
            <img src="assets/currencies/essence.png" height=48 width=48/>
            <div>1</div>
          </div>
        </div>
        <div class="assets">
          <div in:fade={{delay: 1500, duration: 500}}>
          <ItemComponent item={chest}/>
</div>
          <div in:fade={{delay: 2000, duration: 500}}>
            <ItemComponent item={shard}/>
          </div>
        </div>
      </div>
    {/if}
  </div>

  {#if isFinished}
    <button on:click={onClose}>CLOSE</button>
  {/if}
</ModalComponent>
