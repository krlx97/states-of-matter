<script lang="ts">
  import {formatUnits, parseUnits} from "ethers";
  import {ethersService, formService} from "services";
  import {modalStore, walletStore} from "stores";
  import {CurrencyComponent, FormFieldComponent, ModalComponent, FormLoadingComponent} from "ui";

  const {id} = $modalStore.data;
  const name = id === 1n ? "Etheric Crystals" : "Liquidity Provided Etheric Crystals";
  const icon = id === 1n ? "ecr" : "lpecr";
  const balance = id === 1n ? $walletStore.ecr.balance : $walletStore.lpecr.balance;

  const formStore = formService.create({
    amount: ["", "currency", balance]
  });

  const receipt = {
    balance: balance,
    remaining: balance
  };

  const onInput = (): void => {
    formService.validate(formStore);

    const {value, error} = $formStore.fields.amount;

    if (!error) {
      receipt.remaining = balance - parseUnits(value);
    }
  };

  const onSetMax = (): void => {
    $formStore.fields.amount.value = formatUnits(balance);
    onInput();
  };

  const onSubmit = async (): Promise<void> => {
    $formStore.isLoading = true;

    const {somGame} = ethersService.keys;

    if (!$walletStore.isApprovedForAll) {
      const isConfirmed = await ethersService.transact("somTokens", "setApprovedForAll", [somGame]);
    }
    const isConfirmed = await ethersService.transact(
      "somGame",
      "stake",
      [id, parseUnits($formStore.fields.amount.value)]);

    if (isConfirmed) {
      await ethersService.reloadUser();
      onInput();
    }

    $formStore.isLoading = false;
  };
</script>

<ModalComponent>
  <div class="modal">
    <div class="modal__title">Stake</div>
    <div class="modal__info">
      Stake {name} to earn rewards fueled by opening chests, fusing shards and
      trading items.
    </div>

    <form id="stake" on:submit|preventDefault="{onSubmit}">
      <FormFieldComponent
        label="Amount"
        icon="{icon}"
        error="{$formStore.fields.amount.error}"
        action="{["MAX", onSetMax]}"
        bind:value="{$formStore.fields.amount.value}"
        on:input="{onInput}"/>
    </form>

    <div class="modal__table">
      <table>
        <tr>
          <td>BALANCE</td>
          <td><CurrencyComponent name="{icon}" number="{receipt.balance}"/></td>
        </tr>
        <tr>
          <td>REMAINING</td>
          <td><CurrencyComponent name="{icon}" number="{receipt.remaining}"/></td>
        </tr>
      </table>
    </div>

    <FormLoadingComponent form="stake" {formStore}/>
  </div>
</ModalComponent>
