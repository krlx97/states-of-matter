import {utils} from "ethers";
import {get} from "svelte/store";
import {walletStore} from "stores";

interface BuyItemAmountValidator {
  hasValue: boolean;
  isValid: boolean;
  hasCorrectDecimals: boolean;
  isMinValue: boolean;
  isEnoughBalance: boolean;
  isEnoughAmount: boolean;
}

const buyItemAmountValidator = (item: any, amount: string): BuyItemAmountValidator => {
  const balance = get(walletStore).crystals.balance;

  const errors = {
    hasValue: false,
    isValid: false,
    hasCorrectDecimals: false,
    isMinValue: false,
    isEnoughBalance: false,
    isEnoughAmount: false
  };

  errors.hasValue = amount !== "";
  errors.isValid = /^-?\d*[\.]?\d+$/.test(amount);
  errors.hasCorrectDecimals = (amount.split(".")[1] || []).length <= 0;

  if (errors.hasValue && errors.isValid && errors.hasCorrectDecimals) {
    errors.isMinValue = utils.parseUnits(amount).gt(0);
    errors.isEnoughBalance = balance.sub(utils.parseUnits(item.price, 18).mul(amount)).gte(0);
    errors.isEnoughAmount = utils.parseUnits(item.amount, 0).gte(amount);
  } else {
    errors.isMinValue = false;
    errors.isEnoughBalance = false;
    errors.isEnoughAmount = false;
  }

  return errors;
};

export {buyItemAmountValidator};
