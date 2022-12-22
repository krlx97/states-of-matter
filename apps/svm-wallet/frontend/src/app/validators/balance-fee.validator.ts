import type {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const balanceFeeValidator = (balance: string, fee: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const {value} = control;

    if (!value) {
      return null;
    }

    const valueFloat = parseFloat(value);
    const balanceFloat = parseFloat(balance);
    const feeFloat = parseFloat(fee);
    const total = balanceFloat - valueFloat - feeFloat;
    const isValidBalanceFee = total >= 0;

    return !isValidBalanceFee ? {balanceFeeValid: true} : null;
  };
};
