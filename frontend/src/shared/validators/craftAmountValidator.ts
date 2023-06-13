import { BigNumber, ethers } from "ethers";
import { get } from "svelte/store";
import { walletStore } from "../stores/client";

interface CraftAmountValidator {
  hasValue: boolean;
  isValid: boolean;
  hasCorrectDecimals: boolean;
  isMinValue: boolean;
  isEnoughBalance: boolean;
}

const craftAmountValidator = (amount: string, price: string): CraftAmountValidator => {
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
    const essence = get(walletStore).essence.balance;
    const total = ethers.utils.parseUnits(amount, 0).mul(ethers.utils.parseUnits(price, 0));

    errors.isMinValue = ethers.utils.parseUnits(amount).gt(0);
    errors.isEnoughBalance = essence.sub(total).gte(0);
  } else {
    errors.isMinValue = false;
    errors.isEnoughBalance = false;
  }

  return errors;
};

export {craftAmountValidator};
