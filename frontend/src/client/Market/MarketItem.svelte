<script lang="ts">
  import {items} from "data";
  import {ethersService, modalService, socketService } from "services";
  import {playerStore} from "stores";
  import {CurrencyComponent, ItemComponent} from "ui";
  import BuyItemComponent from "./modals/BuyItem.svelte";
    import { parseUnits } from "ethers";

  let item: any;
  let item2 = items.find(({id}) => id === parseInt(item.skinId))

  const onBuyItem = (): void => {
    modalService.open(BuyItemComponent, {item});
  };

  const onCancelItem = async (): Promise<void> => {
    const isConfirmed = await ethersService.transact("game", "cancelItem", [item.listingId]);

    if (!isConfirmed) { return; }
    socketService.socket.emit("getMarketItems" as any);
  };

  export {item};
</script>

<style>
  .item {
    width: 384px;
    padding: var(--spacing-md);
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    background-color: rgb(31, 31, 31);
    border: 2px solid rgb(127, 127, 127);
    border-radius: 8px;
    box-sizing: border-box;
  }

  .item__info {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>

<div class="item">
  <ItemComponent item={item2}/>
  <div class="item__info">
    <table>
      <tr>
        <td>SELLER</td>
        <td>{item.sellerName}</td>
      </tr>
      <tr>
        <td>AMOUNT</td>
        <td>{item.amount}</td>
      </tr>
      <tr>
        <td>PRICE</td>
        <td><CurrencyComponent name="ecr" number={parseUnits(item.price)}/></td>
      </tr>
      <tr>
        <td>BUYOUT</td>
        <td><CurrencyComponent name="ecr" number={parseUnits(item.price) * BigInt(item.amount)}/></td>
      </tr>
    </table>
    {#if item.sellerName === $playerStore.name}
      <button class="button" on:click={onCancelItem}>CANCEL</button>
    {:else}
      <button class="button" on:click={onBuyItem}>BUY</button>
    {/if}
  </div>
</div>
