import type {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export const assetValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const {value} = control;

    if (!value) {
      return null;
    }

    const isValidAsset = (value.toString().split(".")[1] || []).length <= 4;

    return !isValidAsset ? {assetValid: true} : null;
  };
};
