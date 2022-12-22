import type {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const passwordValidator = (): ValidatorFn => {
  return (control: AbstractControl) : ValidationErrors | null => {
    const {value} = control;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);
    const hasLowerCase = /[a-z]+/.test(value);
    const hasNumeric = /[0-9]+/.test(value);
    const passwordValid = hasUpperCase && hasLowerCase && hasNumeric;

    return !passwordValid ? {passwordValid: true} : null;
  };
};
