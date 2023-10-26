<script lang="ts">
  import {ethersService, formService} from "services";
  import {modalStore, walletStore} from "stores";
  import {items} from "data";
    import { CurrencyComponent, FormFieldComponent, FormLoadingComponent } from "ui";

  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);
  const itemWallet = $walletStore.items.find((item) => item.id === id);

  const formStore = formService.create({
    amount: ["", "item", itemWallet.balance],
  });

  const receipt = {
    totalReward: 0,
    owned: itemWallet.balance,
    remaining: itemWallet.balance,
    newBalance: $walletStore.ese.balance
  };

  const getPrice = (): any => {
    const item = items.find((item) => item.id === id);
    if (item.type !== 2) { return 0; }
    return item.disenchantReward;
  }

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.totalReward = getPrice() * parseInt($formStore.fields.amount.value);
      receipt.remaining = receipt.owned - BigInt($formStore.fields.amount.value);
      receipt.newBalance = $walletStore.ese.balance + BigInt(receipt.totalReward);
    } else {
      receipt.totalReward = 0;
      receipt.remaining = receipt.owned;
      receipt.newBalance = $walletStore.ese.balance;
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = `${receipt.owned}`;
    onInput();
  };

  const onDisenchant = async (): Promise<void> => {
    $formStore.isLoading = true;
    const {somGame} = ethersService.keys;

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);
      if (!isConfirmed) {
        const isConfirmed = await ethersService.transact(
          "somGame",
          "disenchantSkins",
          [id, $formStore.fields.amount.value]
        );
        if (!isConfirmed) {
          await ethersService.reloadUser();
          onInput();
        }
      }
    }

    $formStore.isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__info">
    Disenchant skins to obtain etheric essence.
  </div>

  <form id="disenchant" on:submit|preventDefault="{onDisenchant}">
    <FormFieldComponent
      label="Amount"
      error="{$formStore.fields.amount.error}"
      action="{["MAX", onSetMax]}"
      bind:value="{$formStore.fields.amount.value}"
      on:input="{onInput}"/>
  </form>

  <div class="modal__table">
    <table>
      <tr>
        <td>OWNED</td>
        <td>{receipt.owned}</td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td>{receipt.remaining}</td>
      </tr>
      <br/>
      <tr>
        <td>REWARD</td>
        <td><CurrencyComponent name="ese" number="{BigInt(getPrice())}"/></td>
      </tr>
      <tr>
        <td>TOTAL</td>
        <td><CurrencyComponent name="ese" number="{BigInt(receipt.totalReward)}"/></td>
      </tr>
      <tr>
        <td>NEW BALANCE</td>
        <td><CurrencyComponent name="ese" number="{BigInt(receipt.newBalance)}"/></td>
      </tr>
    </table>
  </div>

  <FormLoadingComponent form="disenchant" {formStore}/>
</div>
