import { BigNumber, ethers } from "ethers";
import { get } from "svelte/store";
import { walletStore } from "stores";

interface DisenchantAmountValidator {
  hasValue: boolean;
  isValid: boolean;
  hasCorrectDecimals: boolean;
  isMinValue: boolean;
  isEnoughBalance: boolean;
}

const disenchantAmountValidator = (id: number, amount: string): DisenchantAmountValidator => {
  const errors = {
    hasValue: false,
    isValid: false,
    hasCorrectDecimals: false,
    isMinValue: false,
    isEnoughBalance: false
  }

  errors.hasValue = amount !== "";
  errors.isValid = /^-?\d*[\.]?\d+$/.test(amount);
  errors.hasCorrectDecimals = (amount.split(".")[1] || []).length <= 0;

  if (errors.hasValue && errors.isValid && errors.hasCorrectDecimals) {
    const x = get(walletStore).items.find((item) => item.id === id).balance;
    errors.isMinValue = ethers.utils.parseUnits(amount, 0).gt(0);
    errors.isEnoughBalance = x.sub(amount).gte(0);
  } else {
    errors.isMinValue = false;
    errors.isEnoughBalance = false;
  }

  return errors;
};

export {disenchantAmountValidator};
