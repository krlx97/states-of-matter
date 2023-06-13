import {utils} from "ethers";

interface ItemPriceValidator {
  hasValue: boolean;
  isValid: boolean;
  hasCorrectDecimals: boolean;
  isMinValue: boolean;
}

const listItemPriceValidator = (amount: string): ItemPriceValidator => {
  const errors = {
    hasValue: false,
    isValid: false,
    hasCorrectDecimals: false,
    isMinValue: false
  }

  errors.hasValue = amount !== "";
  errors.isValid = /^-?\d*[\.]?\d+$/.test(amount);
  errors.hasCorrectDecimals = (amount.split(".")[1] || []).length <= 18;

  if (errors.hasValue && errors.isValid && errors.hasCorrectDecimals) {
    errors.isMinValue = utils.parseUnits(amount).gte(utils.parseUnits("1.0", 18));
  } else {
    errors.isMinValue = false;
  }

  return errors;
};

export {listItemPriceValidator};
