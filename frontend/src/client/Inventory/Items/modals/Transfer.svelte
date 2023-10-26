<script lang="ts">
  import {items} from "data";
  import {ethersService, formService} from "services";
  import {modalStore, walletStore} from "stores";
  import {FormFieldComponent, FormLoadingComponent} from "ui";

  const {id} = $modalStore.data;
  const item = items.find((item) => item.id === id);
  const itemWallet = $walletStore.items.find((item) => item.id === id);

  const formStore = formService.create({
    address: ["", "address"],
    amount: ["", "item", itemWallet.balance],
  });

  const receipt = {
    owned: itemWallet.balance,
    remaining: itemWallet.balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    if (!$formStore.fields.amount.error) {
      receipt.remaining = receipt.owned - BigInt($formStore.fields.amount.value);
    } else {
      receipt.remaining = receipt.owned;
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = `${receipt.owned}`;
    onInput();
  };

  const onTransfer = async (): Promise<void> => {
    $formStore.isLoading = true;

    const {somGame} = ethersService.keys;

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("somTokens", "setApprovalForAll", [somGame, true]);

      if (isConfirmed) {
        const isConfirmed = await ethersService.transact(
          "somTokens",
          "safeTransferFrom",
          [ethersService.key, $formStore.fields.address.value, id, $formStore.fields.amount.value, []]
        );

        if (!isConfirmed) {
          await ethersService.reloadUser();
          receipt.owned = $walletStore.items.find((item) => item.id === id).balance;
          onInput();
        }
      }
    }

    $formStore.isLoading = false;
  };
</script>

<div class="modal">
  <div class="modal__info">
    Transfer {item.name} to another Telos EVM address.
  </div>

  <form id="transfer" on:submit|preventDefault="{onTransfer}">
    <FormFieldComponent
      label="Address"
      error="{$formStore.fields.address.error}"
      bind:value="{$formStore.fields.address.value}"
      on:input="{onInput}"/>

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
    </table>
  </div>

  <FormLoadingComponent form="transfer" {formStore}/>
</div>
