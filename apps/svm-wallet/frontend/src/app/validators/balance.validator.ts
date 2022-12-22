import type {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const balanceValidator = (balance: string): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const {value} = control;

    if (!value) {
      return null;
    }

    const balancee = parseFloat(balance);
    const valToFloat = parseFloat(value);
    const total = balancee - valToFloat;
    const isValidBalance = total >= 0;

    return !isValidBalance ? {balanceValid: true} : null;
  };
};
