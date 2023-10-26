<script lang="ts">
  import {items} from "data";
  import {ethersService, formService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CurrencyComponent, FormFieldComponent, FormLoadingComponent} from "ui";

  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);
  const itemWallet = $walletStore.items.find((item) => item.id === id);

  const getPrice = (): number => {
    const item = items.find((item) => item.id === id);
    if (item.type !== 1) { return 0; }
    return item.craftPrice;
  }

  const formStore = formService.create({
    amount: ["", "craft", $walletStore.ese.balance, BigInt(getPrice())],
  });

  const receipt = {
    price: 0,
    remaining: $walletStore.ese.balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.price = getPrice() * parseInt($formStore.fields.amount.value);
      receipt.remaining = $walletStore.ese.balance - BigInt(receipt.price);
    } else {
      receipt.price = 0;
      receipt.remaining = $walletStore.ese.balance;
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = `${$walletStore.ese.balance / BigInt(getPrice())}`;
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;
    const {somGame} = ethersService.keys;

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);
      if (!isConfirmed) {
        const isConfirmed = await ethersService.transact(
          "somGame",
          "craftShards",
          [id, $formStore.fields.amount.value]
        );
        if (isConfirmed) {
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
    Spend Etheric Essence to craft {item.name}.
  </div>

  <form id="craft" on:submit|preventDefault="{onSubmit}">
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
        <td>PRICE</td>
        <td><CurrencyComponent name="ese" number="{BigInt(getPrice())}"/></td>
      </tr>
      <tr>
        <td>TOTAL</td>
        <td><CurrencyComponent name="ese" number="{BigInt(receipt.price)}"/></td>
      </tr>
      <tr>
        <td>REMAINING</td>
        <td><CurrencyComponent name="ese" number="{BigInt(receipt.remaining)}"/></td>
      </tr>
    </table>
  </div>

  <FormLoadingComponent form="craft" {formStore}/>
</div>
