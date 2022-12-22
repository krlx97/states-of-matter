import type {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const nameValidator = (): ValidatorFn => {
  return (control: AbstractControl) : ValidationErrors | null => {
    const {value} = control;

    if (!value) {
      return null;
    }

    const isValidName = /^[a-z1-5.\s]*$/.test(value);

    return !isValidName ? {nameValid: true} : null;
  };
};
