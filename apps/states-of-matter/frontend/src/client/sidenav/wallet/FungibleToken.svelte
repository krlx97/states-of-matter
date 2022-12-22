<script lang="ts">
  import {miscService} from "services";
  import {fly, type FlyParams } from "svelte/transition";

  let ft: any;
  let areBtnsToggled = false;

  const flyParams: FlyParams = {
    y: -8,
    duration: 225,
    opacity: 0
  };

  export {ft};
</script>

<style>
  .ftoken {
    position: relative;
    padding: var(--spacing-md);
    margin-bottom: var(--spacing-md);
    flex-basis: 100%;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border-top-width: 1px;
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
    background: linear-gradient(
      180deg,
      rgba(179, 105, 244, 0.1) 0%,
      rgba(0, 0, 0, 0) 50%,
      rgba(179, 105, 244, 0.1) 100%
    );
  }

  .ftoken__info {
    width: 100%;
    line-height: 1.4;
  }

  .ftoken__info__list {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  .ftoken__info__list__item {
    display: flex;
  }

  .spacer {flex-grow: 1}

  .ftoken__img {
    display: block;
    margin-right: var(--spacing-md);
  }

  .serials {
    position: absolute;
    top: calc(64px + 2 * var(--spacing-md));
    right: 0;
    background-color: rgb(31, 31, 31);
    z-index: 32;
    cursor: initial;
    padding: 1em 0.5em;
    border-top-width: 0;
    border-right-width: 1px;
    border-bottom-width: 0;
    border-left-width: 1px;
    border-style: solid;
    border-image: linear-gradient(
      180deg,
      rgba(63,63,63,1) 0%,
      rgba(255,255,255,1) 50%,
      rgba(63,63,63,1) 100%
    ) 1;
  }

  .serial {
    text-align: left;
    padding: 0.5em 0;
    margin-bottom: 0.5em;
    box-sizing: border-box;
    cursor: pointer;
    transition: text-shadow 225ms ease-in-out, border-image 225ms ease-in-out;
  }

  .serial:last-child {
    margin-bottom: 0;
  }

  .serial:hover {
    text-shadow: rgba(255, 255, 255, 1) 0px 0px 8px;
    border-image: linear-gradient(
      90deg,
      rgba(31,31,31,1) 0%,
      rgba(var(--purple),1) 50%,
      rgba(31,31,31,1) 100%
    ) 1;
  }
</style>

{#if ft.symbol === "TLOS"}
  <div class="ftoken">
    <div class="ftoken__img">
      <img src="assets/currencies/{ft.symbol}.png" alt="X"/>
    </div>
    <div class="ftoken__info">
      <ul class="ftoken__info__list">
        <li class="ftoken__info__list__item">
          {ft.symbol} TOTAL
          <div class="spacer"></div>
          {parseFloat(ft.total).toFixed(4)}
        </li>
        <br/>
        <li class="ftoken__info__list__item">
          LIQUID
          <div class="spacer"></div>
          {parseFloat(ft.liquid).toFixed(4)}
        </li>
      </ul>
    </div>
    <button class="button--icon" on:click={() => areBtnsToggled = !areBtnsToggled}>
      <img src="assets/icons/up.png" alt="More..." style="transform: rotate(180deg)"/>
    </button>
    {#if areBtnsToggled}
      <div class="serials" transition:fly={flyParams}>
        <div class="serial" on:click={() => miscService.openModal("transfer", ft)}>TRANSFER</div>
        <div class="serial" on:click={() => miscService.openModal("swap")}>SWAP</div>
      </div>
    {/if}
  </div>
{:else}
  <div class="ftoken">
    <div class="ftoken__img">
      <img src="assets/currencies/{ft.symbol}.png" alt="X"/>
    </div>
    <div class="ftoken__info">
      <!-- <div>{ft.key.sym}</div> -->
      <ul class="ftoken__info__list">
        <li class="ftoken__info__list__item">
          {ft.symbol} TOTAL <div class="spacer"></div> {parseFloat(ft.total).toFixed(4)}</li>
        <br/>
        <li class="ftoken__info__list__item">LIQUID <div class="spacer"></div> {parseFloat(ft.liquid).toFixed(4)}</li>
        <li class="ftoken__info__list__item">STAKED <div class="spacer"></div> {parseFloat(ft.staked).toFixed(4)}</li>
        <li class="ftoken__info__list__item">UNSTAKING <div class="spacer"></div> {parseFloat(ft.unstaking).toFixed(4)}</li>
      </ul>
    </div>
    <button class="button--icon" on:click={() => areBtnsToggled = !areBtnsToggled}>
      <img src="assets/icons/up.png" alt="More..." style="transform: rotate(180deg)"/>
    </button>
    {#if areBtnsToggled}
      <div class="serials" transition:fly={flyParams}>
        <div class="serial" on:click={() => miscService.openModal("transfer", ft)}>TRANSFER</div>
        <div class="serial" on:click={() => miscService.openModal("swap", ft)}>SWAP</div>
        <div class="serial" on:click={() => miscService.openModal("stake", ft)}>STAKE</div>
        <div class="serial" on:click={() => miscService.openModal("unstake", ft)}>UNSTAKE</div>
        <div class="serial" on:click={() => miscService.openModal("claim", ft)}>CLAIM</div>
      </div>
    {/if}
  </div>
{/if}
