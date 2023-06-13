import { BigNumber, ethers } from "ethers";
import { get } from "svelte/store";
import { walletStore } from "../stores/client";

interface StakeAmountValidator {
  hasValue: boolean;
  isValid: boolean;
  hasCorrectDecimals: boolean;
  isMinValue: boolean;
  isEnoughBalance: boolean;
}

const stakeAmountValidator = (amount: string): StakeAmountValidator => {
  const x = get(walletStore).crystals.balance;

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
    errors.isMinValue = ethers.utils.parseUnits(amount).gt(0);
    errors.isEnoughBalance = x.sub(ethers.utils.parseUnits(amount)).gte(0);
  } else {
    errors.isMinValue = false;
    errors.isEnoughBalance = false;
  }

  return errors;
};

export {stakeAmountValidator};
